# Three Layer KMP Domain Simple

A compact view of shared domain with native presentation and repository implementations.

## Implemented Flow

- Android, iOS, and Desktop own UI plus `HomeViewModel`.
- `sharedDomain` owns `GetTasksUseCase`, the `Task` entity, and the `TaskRepository` contract.
- Native repository/data-source classes keep the shared domain runnable while the diagram stays focused on the domain boundary.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedDomain` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/three-layer-kmp-domain-simple :desktopApp:compileKotlin
./gradlew -p samples/three-layer-kmp-domain-simple :androidApp:assembleDebug
./gradlew -p samples/three-layer-kmp-domain-simple :sharedDomain:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/three-layer-kmp-domain-simple :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
