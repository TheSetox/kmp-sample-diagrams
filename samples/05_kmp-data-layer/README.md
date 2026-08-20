# KMP Data Layer

Native presentation with a shared KMP data layer.

## Implemented Flow

- Android, iOS, and Desktop own UI plus `HomeViewModel`.
- `sharedData` owns `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`.
- Native ViewModels call the shared repository directly.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/05_kmp-data-layer :desktopApp:compileKotlin
./gradlew -p samples/05_kmp-data-layer :androidApp:assembleDebug
./gradlew -p samples/05_kmp-data-layer :sharedData:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/05_kmp-data-layer :sharedData:linkDebugFrameworkIosSimulatorArm64
```

Open `iosApp/iosApp.xcodeproj` and run the shared `iosApp` scheme. Its `Build KMP Frameworks` phase builds and copies the required framework automatically.
