# Samples

Each folder is a standalone sample project for one diagram scenario. Samples target Android, iOS, and desktop only.

## Common Commands

Run commands from the repository root:

```sh
./gradlew -p samples/kmp-compose-ui :desktopApp:run
./gradlew -p samples/kmp-compose-ui :androidApp:assembleDebug
./gradlew -p samples/kmp-compose-ui :shared:assemble
```

For iOS, open the `iosApp` folder in Xcode when present and use the sample README to find the framework-producing Gradle task.

## Sample Index

| Group | Sample | What It Demonstrates |
| --- | --- | --- |
| Baseline | [`normal-native`](normal-native/) | Separate native implementations with no KMP module. |
| Baseline | [`layered-native`](layered-native/) | Platform-specific UI and data layers. |
| Baseline | [`modular-native`](modular-native/) | Platform-specific feature modules. |
| Baseline | [`three-layer-native`](three-layer-native/) | Platform-specific UI, domain, and data layers. |
| Main KMP | [`kmp-native-ui`](kmp-native-ui/) | Shared logic with native UI per platform. |
| Main KMP | [`kmp-compose-ui`](kmp-compose-ui/) | Shared Compose UI and logic. |
| Main KMP | [`kmp-data-layer`](kmp-data-layer/) | Shared data layer only. |
| Main KMP | [`kmp-presentation-layer`](kmp-presentation-layer/) | Shared presentation layer only. |
| Main KMP | [`kmp-ui-layer`](kmp-ui-layer/) | Shared Compose UI only. |
| Main KMP | [`kmp-presentation-data-layer`](kmp-presentation-data-layer/) | Shared presentation and data layers. |
| Modular KMP | [`modular-kmp-data-layer`](modular-kmp-data-layer/) | Feature-scoped shared data layer. |
| Modular KMP | [`modular-kmp-presentation-layer`](modular-kmp-presentation-layer/) | Feature-scoped shared presentation layer. |
| Modular KMP | [`modular-kmp-ui-layer`](modular-kmp-ui-layer/) | Feature-scoped shared UI layer. |
| Modular KMP | [`modular-kmp-ui-data-layer`](modular-kmp-ui-data-layer/) | Feature-scoped shared UI and data layers. |
| Modular KMP | [`modular-kmp-shared-feature`](modular-kmp-shared-feature/) | One shared KMP feature module. |
| Three Layer KMP | [`three-layer-kmp-domain`](three-layer-kmp-domain/) | Shared domain layer. |
| Three Layer KMP | [`three-layer-kmp-domain-simple`](three-layer-kmp-domain-simple/) | Minimal shared domain view. |
| Three Layer KMP | [`three-layer-kmp-domain-data`](three-layer-kmp-domain-data/) | Shared domain and data layers. |
| Three Layer KMP | [`three-layer-kmp-domain-presentation`](three-layer-kmp-domain-presentation/) | Shared domain and presentation layers. |

## Structure Rules

- `androidApp` contains the Android application entry point.
- `desktopApp` contains the desktop application entry point.
- `iosApp` contains SwiftUI entry code and Xcode project files or notes.
- Shared KMP library modules use the Android-KMP library plugin when they expose an Android target.
- Samples intentionally avoid `webApp` and `server` modules.
