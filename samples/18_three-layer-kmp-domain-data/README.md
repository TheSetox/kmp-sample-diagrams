# Three Layer KMP Domain And Data

Domain and data are shared; presentation stays native.

## Implemented Flow

- Android, iOS, and Desktop own UI plus `HomeViewModel`.
- `sharedDomain` owns `GetTasksUseCase` and the `Task` entity.
- `sharedData` owns `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared KMP module for this scenario. |
| `sharedDomain` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/18_three-layer-kmp-domain-data :desktopApp:compileKotlin
./gradlew -p samples/18_three-layer-kmp-domain-data :androidApp:assembleDebug
./gradlew -p samples/18_three-layer-kmp-domain-data :sharedData:assemble
./gradlew -p samples/18_three-layer-kmp-domain-data :sharedDomain:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/18_three-layer-kmp-domain-data :sharedData:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/18_three-layer-kmp-domain-data :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

Open `iosApp/iosApp.xcodeproj` and run the shared `iosApp` scheme. Its `Build KMP Frameworks` phase builds and copies the required exported framework automatically.
