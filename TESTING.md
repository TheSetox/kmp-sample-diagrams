# Verification Notes

Verification updated on May 22, 2026 from `feature/kmp-2026-mermaid-samples`.

## Static Checks

- `python3 -m json.tool diagrams/manifest.json`
- `node --check diagrams/bundle.js`
- `node --check samples/gradle/ios-xcode/generate-ios-projects.js`
- `git diff --check`
- `rg -n "No shared KMP module|sampleDetail|SampleMessage" samples` returned no matches.
- `rg --files -g '*.hprof' -g 'hs_err_pid*'` returned no generated crash/heap files.
- `find samples -path '*/iosApp/iosApp.xcodeproj/project.pbxproj' -type f | wc -l` returned `18`.
- The review branch has no root `*.png` files.
- `feature/legacy-png-reference` exists and preserves the old PNG files.

## Viewer Check

Served the repository root with:

```sh
python3 -m http.server 8000
```

Opened `http://127.0.0.1:8000/index.html` and `http://127.0.0.1:8000/index.html?source=bundle`. The viewer loaded all 18 diagram cards, rendered all 18 Mermaid SVG diagrams, and showed no viewer error state.

## Sample Build Checks

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
```

## Local Tooling Notes

- Plain shared KMP logic/data modules assembled fully, including Kotlin/Native framework tasks.
- Sample-level `gradle.properties` files raise the Gradle daemon heap/metaspace enough for the representative iOS framework links above.
- `13_modular-kmp-ui-data-layer` emits duplicate static KMP symbol warnings because it intentionally links two separate static KMP frameworks for shared UI and shared data; the Xcode build still succeeds.
- Gradle emitted deprecation warnings for Compose dependency accessors such as `compose.material3`; these are warnings from the current Compose Gradle API and did not block compilation.
