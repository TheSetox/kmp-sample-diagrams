# Three Layer KMP Domain

The domain layer is shared; presentation and data implementations stay native.

## Implemented Flow

- Android, iOS, and Desktop own UI, `HomeViewModel`, `TaskRepository`, and `TaskDataSource`.
- `sharedDomain` owns `GetTasksUseCase`, the `Task` entity, and the `TaskRepository` contract.
- Native repositories implement the shared contract and are injected into the shared use case.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedDomain` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/three-layer-kmp-domain :desktopApp:compileKotlin
./gradlew -p samples/three-layer-kmp-domain :androidApp:assembleDebug
./gradlew -p samples/three-layer-kmp-domain :sharedDomain:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/three-layer-kmp-domain :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
