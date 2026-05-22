# KMP Presentation And Data Layers

Shared Compose presentation calls shared KMP data.

## Implemented Flow

- `sharedPresentation` owns `App`, `HomeUiState`, and `HomeViewModel`.
- `sharedData` owns `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`.
- Android, iOS, and Desktop host the shared presentation entry point.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared KMP module for this scenario. |
| `sharedPresentation` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/08_kmp-presentation-data-layer :desktopApp:compileKotlin
./gradlew -p samples/08_kmp-presentation-data-layer :androidApp:assembleDebug
./gradlew -p samples/08_kmp-presentation-data-layer :sharedData:assemble
./gradlew -p samples/08_kmp-presentation-data-layer :sharedPresentation:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/08_kmp-presentation-data-layer :sharedData:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/08_kmp-presentation-data-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
