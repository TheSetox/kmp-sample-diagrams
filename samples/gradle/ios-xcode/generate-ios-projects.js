#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "diagrams/manifest.json"), "utf8"));

const ignoredSwiftImports = new Set([
  "Combine",
  "Foundation",
  "SwiftUI",
  "UIKit",
]);

function uuid(seed) {
  return crypto.createHash("md5").update(seed).digest("hex").slice(0, 24).toUpperCase();
}

function listFiles(dir, predicate) {
  const result = [];
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listFiles(fullPath, predicate));
    } else if (entry.isFile() && predicate(fullPath)) {
      result.push(fullPath);
    }
  }

  return result.sort();
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function pbxQuote(value) {
  return `"${String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")}"`;
}

function pbxArray(values) {
  if (!values.length) return "()";
  return `(\n${values.map((value) => `\t\t\t\t${value},`).join("\n")}\n\t\t\t)`;
}

function sanitizeBundleSegment(value) {
  return value.toLowerCase().replace(/^[0-9]+_/, "").replace(/[^a-z0-9]+/g, "");
}

function findKmpFrameworks(sampleDir, swiftFiles) {
  const moduleByFramework = new Map();

  for (const entry of fs.readdirSync(sampleDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const buildFile = path.join(sampleDir, entry.name, "build.gradle.kts");
    if (!fs.existsSync(buildFile)) continue;

    const match = readText(buildFile).match(/baseName\s*=\s*"([^"]+)"/);
    if (match) {
      moduleByFramework.set(match[1], entry.name);
    }
  }

  const importedFrameworks = [];
  const seen = new Set();

  for (const file of swiftFiles) {
    for (const match of readText(file).matchAll(/^import\s+([A-Za-z][A-Za-z0-9_]*)/gm)) {
      const frameworkName = match[1];
      if (ignoredSwiftImports.has(frameworkName) || seen.has(frameworkName)) continue;
      const gradleModule = moduleByFramework.get(frameworkName);
      if (!gradleModule) continue;
      importedFrameworks.push({ frameworkName, gradleModule });
      seen.add(frameworkName);
    }
  }

  return importedFrameworks;
}

function buildKmpScript(samplePath, frameworks) {
  const specs = frameworks
    .map(({ gradleModule, frameworkName }) => `  "${gradleModule}|${frameworkName}"`)
    .join("\n");

  return `set -euo pipefail

REPO_ROOT="$(cd "$SRCROOT/../../.." && pwd)"
SAMPLE_PATH="${samplePath}"
CONFIGURATION_NAME="\${CONFIGURATION:-Debug}"

if [ "$CONFIGURATION_NAME" = "Release" ]; then
  KMP_BUILD_TYPE="Release"
  KMP_BUILD_TYPE_DIR="releaseFramework"
else
  KMP_BUILD_TYPE="Debug"
  KMP_BUILD_TYPE_DIR="debugFramework"
fi

if [[ "\${SDK_NAME:-iphonesimulator}" == iphoneos* ]]; then
  KMP_TARGET="IosArm64"
  KMP_TARGET_DIR="iosArm64"
else
  KMP_TARGET="IosSimulatorArm64"
  KMP_TARGET_DIR="iosSimulatorArm64"
fi

rm -rf "$SRCROOT/Frameworks"
mkdir -p "$SRCROOT/Frameworks"
FRAMEWORK_SPECS=(
${specs}
)

for SPEC in "\${FRAMEWORK_SPECS[@]}"; do
  IFS="|" read -r GRADLE_MODULE FRAMEWORK_NAME <<< "$SPEC"
  TASK=":\${GRADLE_MODULE}:link\${KMP_BUILD_TYPE}Framework\${KMP_TARGET}"
  "$REPO_ROOT/gradlew" -p "$REPO_ROOT/$SAMPLE_PATH" "$TASK"

  SOURCE_FRAMEWORK="$REPO_ROOT/$SAMPLE_PATH/$GRADLE_MODULE/build/bin/$KMP_TARGET_DIR/$KMP_BUILD_TYPE_DIR/$FRAMEWORK_NAME.framework"
  DEST_FRAMEWORK="$SRCROOT/Frameworks/$FRAMEWORK_NAME.framework"

  if [ ! -d "$SOURCE_FRAMEWORK" ]; then
    echo "Expected framework was not produced: $SOURCE_FRAMEWORK" >&2
    exit 1
  fi

  rm -rf "$DEST_FRAMEWORK"
  cp -R "$SOURCE_FRAMEWORK" "$DEST_FRAMEWORK"
done
`;
}

function makeBuildSettings(sampleDirName, title, frameworks, configuration) {
  const settings = {
    ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: "AccentColor",
    CODE_SIGN_STYLE: "Automatic",
    CURRENT_PROJECT_VERSION: "1",
    DEVELOPMENT_TEAM: "",
    ENABLE_PREVIEWS: "YES",
    GENERATE_INFOPLIST_FILE: "YES",
    INFOPLIST_KEY_CFBundleDisplayName: title,
    INFOPLIST_KEY_UILaunchScreen_Generation: "YES",
    INFOPLIST_KEY_UIApplicationSceneManifest_Generation: "YES",
    IPHONEOS_DEPLOYMENT_TARGET: "18.5",
    "EXCLUDED_ARCHS[sdk=iphonesimulator*]": "x86_64",
    LD_RUNPATH_SEARCH_PATHS: [
      "$(inherited)",
      "@executable_path/Frameworks",
    ],
    MARKETING_VERSION: "1.0",
    PRODUCT_BUNDLE_IDENTIFIER: `com.example.kmpsamples.${sanitizeBundleSegment(sampleDirName)}.iosApp`,
    PRODUCT_NAME: "$(TARGET_NAME)",
    SWIFT_EMIT_LOC_STRINGS: "YES",
    SWIFT_VERSION: "5.0",
    TARGETED_DEVICE_FAMILY: "1,2",
  };

  if (configuration === "Debug") {
    settings.ONLY_ACTIVE_ARCH = "YES";
    settings.SWIFT_ACTIVE_COMPILATION_CONDITIONS = "DEBUG";
    settings.SWIFT_OPTIMIZATION_LEVEL = "-Onone";
  }

  if (frameworks.length) {
    settings.ENABLE_USER_SCRIPT_SANDBOXING = "NO";
    settings.FRAMEWORK_SEARCH_PATHS = [
      "$(inherited)",
      "$(SRCROOT)/Frameworks",
    ];
    settings.OTHER_LDFLAGS = [
      "$(inherited)",
      ...frameworks.flatMap(({ frameworkName }) => ["-framework", frameworkName]),
    ];
  }

  return settings;
}

function formatBuildSettings(settings) {
  const formatKey = (key) => (/^[A-Za-z0-9_]+$/.test(key) ? key : pbxQuote(key));

  return Object.entries(settings)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `\t\t\t\t${formatKey(key)} = ${pbxArray(value.map(pbxQuote))};`;
      }
      return `\t\t\t\t${formatKey(key)} = ${pbxQuote(value)};`;
    })
    .join("\n");
}

function generateProject({ title, sampleDirName, samplePath, swiftFiles, frameworks }) {
  const iosAppDir = path.join(repoRoot, samplePath, "iosApp");
  const xcodeprojDir = path.join(iosAppDir, "iosApp.xcodeproj");
  const projectId = uuid(`${sampleDirName}:project`);
  const targetId = uuid(`${sampleDirName}:target`);
  const mainGroupId = uuid(`${sampleDirName}:mainGroup`);
  const sourcesGroupId = uuid(`${sampleDirName}:sourcesGroup`);
  const frameworksGroupId = uuid(`${sampleDirName}:frameworksGroup`);
  const productsGroupId = uuid(`${sampleDirName}:productsGroup`);
  const productFileId = uuid(`${sampleDirName}:productFile`);
  const sourcesPhaseId = uuid(`${sampleDirName}:sourcesPhase`);
  const frameworksPhaseId = uuid(`${sampleDirName}:frameworksPhase`);
  const kmpPhaseId = uuid(`${sampleDirName}:kmpPhase`);
  const projectConfigListId = uuid(`${sampleDirName}:projectConfigList`);
  const targetConfigListId = uuid(`${sampleDirName}:targetConfigList`);
  const projectDebugId = uuid(`${sampleDirName}:projectDebug`);
  const projectReleaseId = uuid(`${sampleDirName}:projectRelease`);
  const targetDebugId = uuid(`${sampleDirName}:targetDebug`);
  const targetReleaseId = uuid(`${sampleDirName}:targetRelease`);

  const objects = [];
  const addObject = (id, body) => {
    objects.push(`\t\t${id} = {\n${body}\n\t\t};`);
  };

  const swiftRefs = swiftFiles.map((file) => {
    const relativeToSources = path.relative(path.join(iosAppDir, "Sources"), file).replace(/\\/g, "/");
    return {
      path: relativeToSources,
      fileRefId: uuid(`${sampleDirName}:swift:${relativeToSources}:file`),
      buildFileId: uuid(`${sampleDirName}:swift:${relativeToSources}:build`),
    };
  });

  const frameworkRefs = frameworks.map(({ frameworkName }) => ({
    frameworkName,
    fileRefId: uuid(`${sampleDirName}:framework:${frameworkName}:file`),
    buildFileId: uuid(`${sampleDirName}:framework:${frameworkName}:build`),
  }));

  for (const ref of swiftRefs) {
    addObject(
      ref.buildFileId,
      `\t\t\tisa = PBXBuildFile;\n\t\t\tfileRef = ${ref.fileRefId};`,
    );
  }

  for (const ref of frameworkRefs) {
    addObject(
      ref.buildFileId,
      `\t\t\tisa = PBXBuildFile;\n\t\t\tfileRef = ${ref.fileRefId};`,
    );
  }

  addObject(
    productFileId,
    `\t\t\tisa = PBXFileReference;\n\t\t\texplicitFileType = wrapper.application;\n\t\t\tincludeInIndex = 0;\n\t\t\tpath = iosApp.app;\n\t\t\tsourceTree = BUILT_PRODUCTS_DIR;`,
  );

  for (const ref of swiftRefs) {
    addObject(
      ref.fileRefId,
      `\t\t\tisa = PBXFileReference;\n\t\t\tlastKnownFileType = sourcecode.swift;\n\t\t\tpath = ${pbxQuote(ref.path)};\n\t\t\tsourceTree = "<group>";`,
    );
  }

  for (const ref of frameworkRefs) {
    addObject(
      ref.fileRefId,
      `\t\t\tisa = PBXFileReference;\n\t\t\tlastKnownFileType = wrapper.framework;\n\t\t\tpath = ${pbxQuote(`${ref.frameworkName}.framework`)};\n\t\t\tsourceTree = "<group>";`,
    );
  }

  addObject(
    mainGroupId,
    `\t\t\tisa = PBXGroup;\n\t\t\tchildren = ${pbxArray([
      sourcesGroupId,
      ...(frameworkRefs.length ? [frameworksGroupId] : []),
      productsGroupId,
    ])};\n\t\t\tsourceTree = "<group>";`,
  );

  addObject(
    sourcesGroupId,
    `\t\t\tisa = PBXGroup;\n\t\t\tchildren = ${pbxArray(swiftRefs.map((ref) => ref.fileRefId))};\n\t\t\tpath = Sources;\n\t\t\tsourceTree = "<group>";`,
  );

  if (frameworkRefs.length) {
    addObject(
      frameworksGroupId,
      `\t\t\tisa = PBXGroup;\n\t\t\tchildren = ${pbxArray(frameworkRefs.map((ref) => ref.fileRefId))};\n\t\t\tpath = Frameworks;\n\t\t\tsourceTree = "<group>";`,
    );
  }

  addObject(
    productsGroupId,
    `\t\t\tisa = PBXGroup;\n\t\t\tchildren = ${pbxArray([productFileId])};\n\t\t\tname = Products;\n\t\t\tsourceTree = "<group>";`,
  );

  addObject(
    sourcesPhaseId,
    `\t\t\tisa = PBXSourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = ${pbxArray(swiftRefs.map((ref) => ref.buildFileId))};\n\t\t\trunOnlyForDeploymentPostprocessing = 0;`,
  );

  addObject(
    frameworksPhaseId,
    `\t\t\tisa = PBXFrameworksBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = ${pbxArray(frameworkRefs.map((ref) => ref.buildFileId))};\n\t\t\trunOnlyForDeploymentPostprocessing = 0;`,
  );

  if (frameworks.length) {
    addObject(
      kmpPhaseId,
      `\t\t\tisa = PBXShellScriptBuildPhase;\n\t\t\talwaysOutOfDate = 1;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = ();\n\t\t\tinputFileListPaths = ();\n\t\t\tinputPaths = ();\n\t\t\tname = "Build KMP Frameworks";\n\t\t\toutputFileListPaths = ();\n\t\t\toutputPaths = ${pbxArray(frameworks.map(({ frameworkName }) => pbxQuote(`$(SRCROOT)/Frameworks/${frameworkName}.framework`)))};\n\t\t\trunOnlyForDeploymentPostprocessing = 0;\n\t\t\tshellPath = /bin/bash;\n\t\t\tshellScript = ${pbxQuote(buildKmpScript(samplePath, frameworks))};`,
    );
  }

  addObject(
    targetId,
    `\t\t\tisa = PBXNativeTarget;\n\t\t\tbuildConfigurationList = ${targetConfigListId};\n\t\t\tbuildPhases = ${pbxArray([
      ...(frameworks.length ? [kmpPhaseId] : []),
      sourcesPhaseId,
      frameworksPhaseId,
    ])};\n\t\t\tbuildRules = ();\n\t\t\tdependencies = ();\n\t\t\tname = iosApp;\n\t\t\tproductName = iosApp;\n\t\t\tproductReference = ${productFileId};\n\t\t\tproductType = "com.apple.product-type.application";`,
  );

  addObject(
    projectId,
    `\t\t\tisa = PBXProject;\n\t\t\tattributes = {\n\t\t\t\tBuildIndependentTargetsInParallel = 1;\n\t\t\t\tLastSwiftUpdateCheck = 1600;\n\t\t\t\tLastUpgradeCheck = 1600;\n\t\t\t\tTargetAttributes = {\n\t\t\t\t\t${targetId} = {\n\t\t\t\t\t\tCreatedOnToolsVersion = 16.0;\n\t\t\t\t\t};\n\t\t\t\t};\n\t\t\t};\n\t\t\tbuildConfigurationList = ${projectConfigListId};\n\t\t\tcompatibilityVersion = "Xcode 15.0";\n\t\t\tdevelopmentRegion = en;\n\t\t\thasScannedForEncodings = 0;\n\t\t\tknownRegions = (\n\t\t\t\ten,\n\t\t\t\tBase,\n\t\t\t);\n\t\t\tmainGroup = ${mainGroupId};\n\t\t\tproductRefGroup = ${productsGroupId};\n\t\t\tprojectDirPath = "";\n\t\t\tprojectRoot = "";\n\t\t\ttargets = ${pbxArray([targetId])};`,
  );

  const projectDebugSettings = {
    ALWAYS_SEARCH_USER_PATHS: "NO",
    CLANG_ANALYZER_NONNULL: "YES",
    CLANG_ENABLE_MODULES: "YES",
    CLANG_ENABLE_OBJC_ARC: "YES",
    CLANG_ENABLE_OBJC_WEAK: "YES",
    CLANG_WARN_DOCUMENTATION_COMMENTS: "YES",
    CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER: "YES",
    DEBUG_INFORMATION_FORMAT: "dwarf",
    ENABLE_STRICT_OBJC_MSGSEND: "YES",
    GCC_C_LANGUAGE_STANDARD: "gnu17",
    GCC_NO_COMMON_BLOCKS: "YES",
    GCC_OPTIMIZATION_LEVEL: "0",
    SDKROOT: "iphoneos",
    SUPPORTED_PLATFORMS: "iphoneos iphonesimulator",
  };
  const projectReleaseSettings = {
    ...projectDebugSettings,
    DEBUG_INFORMATION_FORMAT: "dwarf-with-dsym",
    GCC_OPTIMIZATION_LEVEL: "s",
    VALIDATE_PRODUCT: "YES",
  };

  addObject(
    projectDebugId,
    `\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {\n${formatBuildSettings(projectDebugSettings)}\n\t\t\t};\n\t\t\tname = Debug;`,
  );
  addObject(
    projectReleaseId,
    `\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {\n${formatBuildSettings(projectReleaseSettings)}\n\t\t\t};\n\t\t\tname = Release;`,
  );
  addObject(
    targetDebugId,
    `\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {\n${formatBuildSettings(makeBuildSettings(sampleDirName, title, frameworks, "Debug"))}\n\t\t\t};\n\t\t\tname = Debug;`,
  );
  addObject(
    targetReleaseId,
    `\t\t\tisa = XCBuildConfiguration;\n\t\t\tbuildSettings = {\n${formatBuildSettings(makeBuildSettings(sampleDirName, title, frameworks, "Release"))}\n\t\t\t};\n\t\t\tname = Release;`,
  );

  addObject(
    projectConfigListId,
    `\t\t\tisa = XCConfigurationList;\n\t\t\tbuildConfigurations = ${pbxArray([projectDebugId, projectReleaseId])};\n\t\t\tdefaultConfigurationIsVisible = 0;\n\t\t\tdefaultConfigurationName = Release;`,
  );
  addObject(
    targetConfigListId,
    `\t\t\tisa = XCConfigurationList;\n\t\t\tbuildConfigurations = ${pbxArray([targetDebugId, targetReleaseId])};\n\t\t\tdefaultConfigurationIsVisible = 0;\n\t\t\tdefaultConfigurationName = Release;`,
  );

  const pbxproj = `// !$*UTF8*$!
{
\tarchiveVersion = 1;
\tclasses = {
\t};
\tobjectVersion = 56;
\tobjects = {
${objects.join("\n\n")}
\t};
\trootObject = ${projectId};
}
`;

  fs.rmSync(xcodeprojDir, { recursive: true, force: true });
  writeText(path.join(xcodeprojDir, "project.pbxproj"), pbxproj);
  writeText(
    path.join(xcodeprojDir, "project.xcworkspace/contents.xcworkspacedata"),
    `<?xml version="1.0" encoding="UTF-8"?>
<Workspace
   version = "1.0">
   <FileRef
      location = "self:">
   </FileRef>
</Workspace>
`,
  );
  writeText(
    path.join(xcodeprojDir, "xcshareddata/xcschemes/iosApp.xcscheme"),
    `<?xml version="1.0" encoding="UTF-8"?>
<Scheme
   LastUpgradeVersion = "1600"
   version = "1.7">
   <BuildAction
      parallelizeBuildables = "YES"
      buildImplicitDependencies = "YES">
      <BuildActionEntries>
         <BuildActionEntry
            buildForTesting = "YES"
            buildForRunning = "YES"
            buildForProfiling = "YES"
            buildForArchiving = "YES"
            buildForAnalyzing = "YES">
            <BuildableReference
               BuildableIdentifier = "primary"
               BlueprintIdentifier = "${targetId}"
               BuildableName = "iosApp.app"
               BlueprintName = "iosApp"
               ReferencedContainer = "container:iosApp.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <TestAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      shouldUseLaunchSchemeArgsEnv = "YES">
   </TestAction>
   <LaunchAction
      buildConfiguration = "Debug"
      selectedDebuggerIdentifier = "Xcode.DebuggerFoundation.Debugger.LLDB"
      selectedLauncherIdentifier = "Xcode.DebuggerFoundation.Launcher.LLDB"
      launchStyle = "0"
      useCustomWorkingDirectory = "NO"
      ignoresPersistentStateOnLaunch = "NO"
      debugDocumentVersioning = "YES"
      debugServiceExtension = "internal"
      allowLocationSimulation = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "${targetId}"
            BuildableName = "iosApp.app"
            BlueprintName = "iosApp"
            ReferencedContainer = "container:iosApp.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </LaunchAction>
   <ProfileAction
      buildConfiguration = "Release"
      shouldUseLaunchSchemeArgsEnv = "YES"
      savedToolIdentifier = ""
      useCustomWorkingDirectory = "NO"
      debugDocumentVersioning = "YES">
      <BuildableProductRunnable
         runnableDebuggingMode = "0">
         <BuildableReference
            BuildableIdentifier = "primary"
            BlueprintIdentifier = "${targetId}"
            BuildableName = "iosApp.app"
            BlueprintName = "iosApp"
            ReferencedContainer = "container:iosApp.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction
      buildConfiguration = "Debug">
   </AnalyzeAction>
   <ArchiveAction
      buildConfiguration = "Release"
      revealArchiveInOrganizer = "YES">
   </ArchiveAction>
</Scheme>
`,
  );
}

function generateReadme({ title, samplePath, frameworks }) {
  const hasFrameworks = frameworks.length > 0;
  const frameworkList = frameworks.map(({ frameworkName }) => frameworkName).join(", ");
  const gradleTasks = frameworks
    .map(({ gradleModule }) => `./gradlew -p ${samplePath} :${gradleModule}:linkDebugFrameworkIosSimulatorArm64`)
    .join("\n");

  return `# iOS App

Open \`iosApp.xcodeproj\` in Xcode and run the shared \`iosApp\` scheme on an iOS simulator.

This is a real SwiftUI application target for the \`${title}\` sample. The target compiles every Swift file under \`Sources/\`${hasFrameworks ? " and links the KMP framework or frameworks listed below" : " and does not link a KMP framework"}.

${hasFrameworks ? `The Xcode target includes a \`Build KMP Frameworks\` phase, so running from Xcode builds and copies: ${frameworkList}.\n\nEquivalent framework task${frameworks.length === 1 ? "" : "s"}:\n\n\`\`\`sh\n${gradleTasks}\n\`\`\`\n` : "No extra setup is required beyond selecting an iOS simulator.\n"}
`;
}

const generated = [];

for (const entry of manifest) {
  const samplePath = entry.sample;
  const sampleDir = path.join(repoRoot, samplePath);
  const iosAppDir = path.join(sampleDir, "iosApp");
  if (!fs.existsSync(iosAppDir)) continue;

  const swiftFiles = listFiles(path.join(iosAppDir, "Sources"), (file) => file.endsWith(".swift"));
  const frameworks = findKmpFrameworks(sampleDir, swiftFiles);
  const sampleDirName = path.basename(sampleDir);

  generateProject({
    title: entry.title,
    sampleDirName,
    samplePath,
    swiftFiles,
    frameworks,
  });
  writeText(path.join(iosAppDir, "README.md"), `${generateReadme({
    title: entry.title,
    samplePath,
    frameworks,
  }).trimEnd()}\n`);
  generated.push(`${samplePath}/iosApp`);
}

console.log(`Generated ${generated.length} iOS Xcode projects.`);
