# KMP UI Layer

Shared Compose UI only; behavior remains native.

## Implemented Flow

- `sharedUI` exposes `HomeUiState`, `App(state, onRefresh)`, and the iOS `MainViewController(...)` factory.
- Android, iOS, and Desktop own `HomeViewModel -> TaskRepository -> TaskDataSource`.
- Native ViewModels pass state and callbacks into the shared UI.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedUI` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/kmp-ui-layer :desktopApp:compileKotlin
./gradlew -p samples/kmp-ui-layer :androidApp:assembleDebug
./gradlew -p samples/kmp-ui-layer :sharedUI:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/kmp-ui-layer :sharedUI:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
