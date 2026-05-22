# KMP Native UI

Native UI on each platform calls fully shared KMP logic.

## Implemented Flow

- Android, iOS, and Desktop entry points stay native.
- `sharedLogic` owns `HomeViewModel -> GetTasksUseCase -> TaskRepository -> TaskDataSource`.
- The shared ViewModel returns display text for the platform UI.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedLogic` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/02_kmp-native-ui :desktopApp:compileKotlin
./gradlew -p samples/02_kmp-native-ui :androidApp:assembleDebug
./gradlew -p samples/02_kmp-native-ui :sharedLogic:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/02_kmp-native-ui :sharedLogic:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
