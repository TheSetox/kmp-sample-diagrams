# KMP Data Layer

Shared data in KMP. Each app target keeps its native UI and ViewModel, then calls the shared Repository and DataSource implementation.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared Repository and DataSource KMP library. |

## Run

```sh
./gradlew -p samples/kmp-data-layer :desktopApp:run
./gradlew -p samples/kmp-data-layer :androidApp:assembleDebug
./gradlew -p samples/kmp-data-layer :sharedData:assemble
```

## iOS

```sh
./gradlew -p samples/kmp-data-layer :sharedData:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
