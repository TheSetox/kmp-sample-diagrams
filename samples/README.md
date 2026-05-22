# Samples

Each folder is a standalone runnable architecture demo for one diagram scenario. Samples target Android, iOS, and desktop only, and use deterministic Task/Details data so the architecture boundaries are easy to inspect.

## Common Commands

Run commands from the repository root:

```sh
./gradlew -p samples/03_kmp-compose-ui :desktopApp:compileKotlin
./gradlew -p samples/03_kmp-compose-ui :androidApp:assembleDebug
./gradlew -p samples/03_kmp-compose-ui :shared:assemble
xcodebuild -project samples/03_kmp-compose-ui/iosApp/iosApp.xcodeproj -scheme iosApp -configuration Debug -sdk iphonesimulator -derivedDataPath samples/03_kmp-compose-ui/build/xcode-derived-data CODE_SIGNING_ALLOWED=NO build
```

Android commands require a local Android SDK. For iOS, open `iosApp/iosApp.xcodeproj` in Xcode and run the shared `iosApp` scheme; KMP-backed samples build and copy their frameworks through the Xcode `Build KMP Frameworks` phase.

For a per-module review map, open [`implementation-review.html`](implementation-review.html) or read [`IMPLEMENTATION_REVIEW.md`](IMPLEMENTATION_REVIEW.md).

## Sample Index

| Group | Sample | What It Demonstrates | First Implemented Flow |
| --- | --- | --- | --- |
| Baseline | [`01_normal-native`](01_normal-native/) | Separate native implementations with no shared KMP module. | Android: MainActivity renders native UI and calls HomeViewModel -> TaskRepository -> TaskDataSource. |
| Baseline | [`04_layered-native`](04_layered-native/) | Each platform separates presentation and data classes; this two-layer scenario intentionally has no use case. | Android: presentation HomeViewModel calls data TaskRepository -> TaskDataSource. |
| Baseline | [`09_modular-native`](09_modular-native/) | Feature one and feature two are implemented separately on every platform. | Feature one: native HomeViewModel -> TaskRepository -> TaskDataSource. |
| Baseline | [`15_three-layer-native`](15_three-layer-native/) | Every platform owns its own presentation, domain, and data layers. | Presentation: native UI calls HomeViewModel. |
| Main KMP | [`02_kmp-native-ui`](02_kmp-native-ui/) | Native UI on each platform calls fully shared KMP logic. | Android, iOS, and Desktop entry points stay native. |
| Main KMP | [`03_kmp-compose-ui`](03_kmp-compose-ui/) | Shared Compose UI with platform-specific logic. | shared exposes HomeUiState, App(state, onRefresh), and the iOS MainViewController(...) factory. |
| Main KMP | [`05_kmp-data-layer`](05_kmp-data-layer/) | Native presentation with a shared KMP data layer. | Android, iOS, and Desktop own UI plus HomeViewModel. |
| Main KMP | [`06_kmp-presentation-layer`](06_kmp-presentation-layer/) | Shared Compose UI and shared ViewModel with native data implementations. | sharedPresentation owns App, HomeUiState, and HomeViewModel. |
| Main KMP | [`07_kmp-ui-layer`](07_kmp-ui-layer/) | Shared Compose UI only; behavior remains native. | sharedUI exposes HomeUiState, App(state, onRefresh), and the iOS MainViewController(...) factory. |
| Main KMP | [`08_kmp-presentation-data-layer`](08_kmp-presentation-data-layer/) | Shared Compose presentation calls shared KMP data. | sharedPresentation owns App, HomeUiState, and HomeViewModel. |
| Modular KMP | [`10_modular-kmp-data-layer`](10_modular-kmp-data-layer/) | Feature two uses shared data while Feature One is native and visible. | Feature One lives in platform `featureone` / `Sources/FeatureOne` code and renders FeatureOneScreen/View -> HomeViewModel -> TaskRepository -> TaskDataSource. |
| Modular KMP | [`11_modular-kmp-presentation-layer`](11_modular-kmp-presentation-layer/) | Feature two has shared Compose presentation while Feature One is native and visible. | Feature One lives in platform `featureone` / `Sources/FeatureOne` code and renders FeatureOneScreen/View -> HomeViewModel -> TaskRepository -> TaskDataSource. |
| Modular KMP | [`12_modular-kmp-ui-layer`](12_modular-kmp-ui-layer/) | Feature two shares Compose UI while Feature One is native and visible. | Feature One lives in platform `featureone` / `Sources/FeatureOne` code and renders FeatureOneScreen/View -> HomeViewModel -> TaskRepository -> TaskDataSource. |
| Modular KMP | [`13_modular-kmp-ui-data-layer`](13_modular-kmp-ui-data-layer/) | Feature two shares Compose UI and data while Feature One is native and visible. | Feature One lives in platform `featureone` / `Sources/FeatureOne` code and renders FeatureOneScreen/View -> HomeViewModel -> TaskRepository -> TaskDataSource. |
| Modular KMP | [`14_modular-kmp-shared-feature`](14_modular-kmp-shared-feature/) | Feature two is fully shared while Feature One is native and visible. | Feature One lives in platform `featureone` / `Sources/FeatureOne` code outside the shared Feature Two module and renders FeatureOneScreen/View -> HomeViewModel -> TaskRepository -> TaskDataSource. |
| Three Layer KMP | [`16_three-layer-kmp-domain`](16_three-layer-kmp-domain/) | The domain layer is shared; presentation and data implementations stay native. | Android, iOS, and Desktop own UI, HomeViewModel, TaskRepository, and TaskDataSource. |
| Three Layer KMP | [`18_three-layer-kmp-domain-data`](18_three-layer-kmp-domain-data/) | Domain and data are shared; presentation stays native. | Android, iOS, and Desktop own UI plus HomeViewModel. |
| Three Layer KMP | [`19_three-layer-kmp-domain-presentation`](19_three-layer-kmp-domain-presentation/) | Domain and presentation are shared; data implementations stay native. | Platform entries host shared presentation and provide native TaskRepository -> TaskDataSource. |

## Structure Rules

- `androidApp` contains the Android application entry point.
- `desktopApp` contains the desktop application entry point.
- `iosApp` contains SwiftUI entry code and a runnable `iosApp.xcodeproj` app target.
- Shared KMP library modules use the Android-KMP library plugin when they expose an Android target.
- Android app modules use AGP built-in Kotlin and do not apply `org.jetbrains.kotlin.android`.
- Samples intentionally avoid `webApp` and `server` modules.
