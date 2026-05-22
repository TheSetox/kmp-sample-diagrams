# Samples

Each folder is a standalone runnable architecture demo for one diagram scenario. Samples target Android, iOS, and desktop only, and use deterministic Task/Details data so the architecture boundaries are easy to inspect.

## Common Commands

Run commands from the repository root:

```sh
./gradlew -p samples/kmp-compose-ui :desktopApp:compileKotlin
./gradlew -p samples/kmp-compose-ui :androidApp:assembleDebug
./gradlew -p samples/kmp-compose-ui :shared:assemble
```

Android commands require a local Android SDK. For iOS, open the `iosApp` folder in Xcode when present and use each sample README to find the framework-producing Gradle task.

For a per-module review map, open [`implementation-review.html`](implementation-review.html) or read [`IMPLEMENTATION_REVIEW.md`](IMPLEMENTATION_REVIEW.md).

## Sample Index

| Group | Sample | What It Demonstrates | First Implemented Flow |
| --- | --- | --- | --- |
| Baseline | [`normal-native`](normal-native/) | Separate native implementations with no shared KMP module. | Android: MainActivity renders native UI and calls HomeViewModel -> TaskRepository -> TaskDataSource. |
| Baseline | [`layered-native`](layered-native/) | Each platform separates presentation and data classes; this two-layer scenario intentionally has no use case. | Android: presentation HomeViewModel calls data TaskRepository -> TaskDataSource. |
| Baseline | [`modular-native`](modular-native/) | Feature one and feature two are implemented separately on every platform. | Feature one: native HomeViewModel -> TaskRepository -> TaskDataSource. |
| Baseline | [`three-layer-native`](three-layer-native/) | Every platform owns its own presentation, domain, and data layers. | Presentation: native UI calls HomeViewModel. |
| Main KMP | [`kmp-native-ui`](kmp-native-ui/) | Native UI on each platform calls fully shared KMP logic. | Android, iOS, and Desktop entry points stay native. |
| Main KMP | [`kmp-compose-ui`](kmp-compose-ui/) | Shared Compose UI with platform-specific logic. | shared exposes HomeUiState, App(state, onRefresh), and the iOS MainViewController(...) factory. |
| Main KMP | [`kmp-data-layer`](kmp-data-layer/) | Native presentation with a shared KMP data layer. | Android, iOS, and Desktop own UI plus HomeViewModel. |
| Main KMP | [`kmp-presentation-layer`](kmp-presentation-layer/) | Shared Compose UI and shared ViewModel with native data implementations. | sharedPresentation owns App, HomeUiState, and HomeViewModel. |
| Main KMP | [`kmp-ui-layer`](kmp-ui-layer/) | Shared Compose UI only; behavior remains native. | sharedUI exposes HomeUiState, App(state, onRefresh), and the iOS MainViewController(...) factory. |
| Main KMP | [`kmp-presentation-data-layer`](kmp-presentation-data-layer/) | Shared Compose presentation calls shared KMP data. | sharedPresentation owns App, HomeUiState, and HomeViewModel. |
| Modular KMP | [`modular-kmp-data-layer`](modular-kmp-data-layer/) | Feature two uses shared data while Feature One is native and visible. | Feature One renders native HomeViewModel -> TaskRepository -> TaskDataSource in each platform. |
| Modular KMP | [`modular-kmp-presentation-layer`](modular-kmp-presentation-layer/) | Feature two has shared Compose presentation while Feature One is native and visible. | Feature One renders native HomeViewModel -> TaskRepository -> TaskDataSource in each platform. |
| Modular KMP | [`modular-kmp-ui-layer`](modular-kmp-ui-layer/) | Feature two shares Compose UI while Feature One is native and visible. | Feature One renders native HomeViewModel -> TaskRepository -> TaskDataSource in each platform. |
| Modular KMP | [`modular-kmp-ui-data-layer`](modular-kmp-ui-data-layer/) | Feature two shares Compose UI and data while Feature One is native and visible. | Feature One renders native HomeViewModel -> TaskRepository -> TaskDataSource in each platform. |
| Modular KMP | [`modular-kmp-shared-feature`](modular-kmp-shared-feature/) | Feature two is fully shared while Feature One is native and visible. | Feature One renders natively outside the shared Feature Two module. |
| Three Layer KMP | [`three-layer-kmp-domain`](three-layer-kmp-domain/) | The domain layer is shared; presentation and data implementations stay native. | Android, iOS, and Desktop own UI, HomeViewModel, TaskRepository, and TaskDataSource. |
| Three Layer KMP | [`three-layer-kmp-domain-simple`](three-layer-kmp-domain-simple/) | A compact view of shared domain with native presentation and repository implementations. | Android, iOS, and Desktop own UI plus HomeViewModel. |
| Three Layer KMP | [`three-layer-kmp-domain-data`](three-layer-kmp-domain-data/) | Domain and data are shared; presentation stays native. | Android, iOS, and Desktop own UI plus HomeViewModel. |
| Three Layer KMP | [`three-layer-kmp-domain-presentation`](three-layer-kmp-domain-presentation/) | Domain and presentation are shared; data implementations stay native. | sharedPresentation owns App -> HomeScreen -> HomeViewModel -> HomeUiState. |

## Structure Rules

- `androidApp` contains the Android application entry point.
- `desktopApp` contains the desktop application entry point.
- `iosApp` contains SwiftUI entry code and Xcode project files or notes.
- Shared KMP library modules use the Android-KMP library plugin when they expose an Android target.
- Android app modules use AGP built-in Kotlin and do not apply `org.jetbrains.kotlin.android`.
- Samples intentionally avoid `webApp` and `server` modules.
