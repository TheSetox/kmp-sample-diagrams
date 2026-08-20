# KMP Compose UI

Shared Compose UI with platform-specific logic.

## Implemented Flow

- `shared` exposes `HomeUiState`, `App(state, onRefresh)`, and the iOS `MainViewController(...)` factory.
- Android, iOS, and Desktop own `HomeViewModel -> TaskRepository -> TaskDataSource`.
- Native ViewModels pass state and refresh callbacks into the shared UI.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `shared` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/03_kmp-compose-ui :desktopApp:compileKotlin
./gradlew -p samples/03_kmp-compose-ui :androidApp:assembleDebug
./gradlew -p samples/03_kmp-compose-ui :shared:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/03_kmp-compose-ui :shared:linkDebugFrameworkIosSimulatorArm64
```

Open `iosApp/iosApp.xcodeproj` and run the shared `iosApp` scheme. Its `Build KMP Frameworks` phase builds and copies the required framework automatically.
