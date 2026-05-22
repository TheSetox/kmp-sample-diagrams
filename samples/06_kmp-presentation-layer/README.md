# KMP Presentation Layer

Shared Compose UI and shared ViewModel with native data implementations.

## Implemented Flow

- `sharedPresentation` owns `App`, `HomeUiState`, and `HomeViewModel`.
- `HomeViewModel` depends on the shared `TaskRepository` contract.
- Android, iOS, and Desktop implement the repository contract with native `TaskDataSource` classes.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedPresentation` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/06_kmp-presentation-layer :desktopApp:compileKotlin
./gradlew -p samples/06_kmp-presentation-layer :androidApp:assembleDebug
./gradlew -p samples/06_kmp-presentation-layer :sharedPresentation:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/06_kmp-presentation-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
