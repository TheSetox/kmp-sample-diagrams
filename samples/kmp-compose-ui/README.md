# KMP Compose UI

Shared Compose UI with platform-specific ViewModel, repository, and data source logic.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `shared` | Shared Compose UI KMP library. |

## Run

```sh
./gradlew -p samples/kmp-compose-ui :desktopApp:run
./gradlew -p samples/kmp-compose-ui :androidApp:assembleDebug
./gradlew -p samples/kmp-compose-ui :shared:assemble
```

## iOS

```sh
./gradlew -p samples/kmp-compose-ui :shared:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework in Xcode.
