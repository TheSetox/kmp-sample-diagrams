# Verification Notes

Verification checklist updated on September 6, 2026 before publishing to `main`.

## Static Checks

- `python3 -m json.tool diagrams/manifest.json`
- `npm run validate`
- `npm run render:check`
- `npm run catalog:check`
- `npm run pages:build`
- `node --check diagrams/catalog.js`
- `node --check samples/gradle/ios-xcode/generate-ios-projects.js`
- `git diff --check`
- `rg -n "No shared KMP module|sampleDetail|SampleMessage" samples` returned no matches.
- `rg --files -g '*.hprof' -g 'hs_err_pid*'` returned no generated crash/heap files.
- `find samples -path '*/iosApp/iosApp.xcodeproj/project.pbxproj' -type f | wc -l` returned `18`.
- The repository has exactly 18 manifest entries, diagram detail files, structured specifications, full and preview SVG/PNG pairs, sample directories, Xcode projects, and shared Xcode schemes.
- Every Kotlin or Swift file declared by a diagram specification resolves to source in its matching sample.
- The repository has no loose root `*.png` files; current PNG deliverables live under `diagrams/images/` and `diagrams/previews/`.
- `feature/legacy-png-reference` exists and preserves the original PNG set.

## Viewer Check

Served the repository root with:

```sh
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/index.html`, `http://127.0.0.1:8000/index.html?source=catalog`, and the repository's `index.html` directly from `file://`. In every mode, confirm that all 18 cards and SVGs load, each SVG/PNG/details/sample action resolves, and pan, zoom, Fit, and Reset work without viewer or console errors. No client-side diagram renderer is required.

## Sample Build Checks

The complete command inventory below was verified on May 22, 2026. On August 21, 2026, the exact CI Android/desktop and iOS simulator commands were rerun successfully for the complex `19_three-layer-kmp-domain-presentation` sample, including its Kotlin/Native framework phase. GitHub CI now applies the same checks to all 18 samples on pushes to `main` and on pull requests.

Android commands were run with `ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk`. Gradle was run serially because this local setup has a small default daemon heap/metaspace.

### Native Baselines

```sh
./gradlew -p samples/01_normal-native :desktopApp:compileKotlin
./gradlew -p samples/04_layered-native :desktopApp:compileKotlin
./gradlew -p samples/09_modular-native :desktopApp:compileKotlin
./gradlew -p samples/15_three-layer-native :desktopApp:compileKotlin
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/01_normal-native :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/04_layered-native :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/09_modular-native :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/15_three-layer-native :androidApp:assembleDebug
```

### Main KMP Samples

```sh
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/02_kmp-native-ui :sharedLogic:assemble :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/03_kmp-compose-ui :shared:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/07_kmp-ui-layer :sharedUI:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/05_kmp-data-layer :sharedData:assemble :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/06_kmp-presentation-layer :sharedPresentation:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/08_kmp-presentation-data-layer :sharedData:assemble :sharedPresentation:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
```

### Modular KMP Samples

```sh
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/10_modular-kmp-data-layer :featureTwoSharedData:assemble :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/12_modular-kmp-ui-layer :featureTwoSharedUI:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/13_modular-kmp-ui-data-layer :featureTwoSharedData:assemble :featureTwoSharedUI:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/11_modular-kmp-presentation-layer :featureTwoSharedPresentation:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/14_modular-kmp-shared-feature :featureTwoSharedFeature:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
```

### Three Layer KMP Samples

```sh
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/16_three-layer-kmp-domain :sharedDomain:assemble :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/18_three-layer-kmp-domain-data :sharedData:assemble :sharedDomain:assemble :desktopApp:compileKotlin :androidApp:assembleDebug
ANDROID_HOME=/Users/stephensiapno/Library/Android/sdk ./gradlew -p samples/19_three-layer-kmp-domain-presentation :sharedDomain:assemble :sharedPresentation:compileKotlinDesktop :desktopApp:compileKotlin :androidApp:assembleDebug
```

### iOS Xcode Projects

Each sample now has a real SwiftUI app target at `iosApp/iosApp.xcodeproj` with a shared `iosApp` scheme. KMP-backed projects include a `Build KMP Frameworks` Xcode phase that runs the matching Gradle framework link task and copies the framework into `iosApp/Frameworks` before Swift compilation.

Representative commands that succeeded locally:

```sh
xcodebuild -list -project samples/01_normal-native/iosApp/iosApp.xcodeproj
xcodebuild -list -project samples/02_kmp-native-ui/iosApp/iosApp.xcodeproj
xcodebuild -project samples/01_normal-native/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/01_normal-native/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO build
xcodebuild -project samples/02_kmp-native-ui/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/02_kmp-native-ui/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO build
xcodebuild -project samples/03_kmp-compose-ui/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/03_kmp-compose-ui/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO -quiet build
xcodebuild -project samples/08_kmp-presentation-data-layer/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/08_kmp-presentation-data-layer/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO -quiet build
xcodebuild -project samples/13_modular-kmp-ui-data-layer/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/13_modular-kmp-ui-data-layer/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO -quiet build
xcodebuild -project samples/18_three-layer-kmp-domain-data/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/18_three-layer-kmp-domain-data/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO -quiet build
xcodebuild -project samples/19_three-layer-kmp-domain-presentation/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath /tmp/kmp-ci-derived-data CODE_SIGNING_ALLOWED=NO COMPILER_INDEX_STORE_ENABLE=NO build
```

## Local Tooling Notes

- Plain shared KMP logic/data modules assembled fully, including Kotlin/Native framework tasks.
- Sample-level `gradle.properties` files raise the Gradle daemon heap/metaspace enough for the representative iOS framework links above.
- `13_modular-kmp-ui-data-layer` emits duplicate static KMP symbol warnings because it intentionally links two separate static KMP frameworks for shared UI and shared data; the Xcode build still succeeds.
- Gradle emitted deprecation warnings for Compose dependency accessors such as `compose.material3`; these are warnings from the current Compose Gradle API and did not block compilation.
