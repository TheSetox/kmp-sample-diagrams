# Three Layer KMP Domain And Presentation

Domain and presentation are shared; data implementations stay native.

## Implemented Flow

- `androidApp/MainActivity`, `iosApp/ContentView`, and `desktopApp/Main.kt` remain the platform entry points.
- `sharedPresentation` owns `App -> HomeScreen -> HomeViewModel -> HomeUiState`.
- `sharedDomain` owns `GetTasksUseCase`, the `Task` entity, and the `TaskRepository` contract.
- Android, iOS, and Desktop implement `TaskRepository -> TaskDataSource` natively and pass the contract into shared presentation.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedDomain` | Shared KMP module for this scenario. |
| `sharedPresentation` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/19_three-layer-kmp-domain-presentation :desktopApp:compileKotlin
./gradlew -p samples/19_three-layer-kmp-domain-presentation :androidApp:assembleDebug
./gradlew -p samples/19_three-layer-kmp-domain-presentation :sharedDomain:assemble
./gradlew -p samples/19_three-layer-kmp-domain-presentation :sharedPresentation:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/19_three-layer-kmp-domain-presentation :sharedDomain:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/19_three-layer-kmp-domain-presentation :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
