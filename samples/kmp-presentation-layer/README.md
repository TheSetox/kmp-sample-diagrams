# KMP Presentation Layer

Shared presentation with Compose UI and ViewModel in KMP. Repository and data source implementations stay native.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedPresentation` | Shared Compose UI and ViewModel KMP library. |

## Run

```sh
./gradlew -p samples/kmp-presentation-layer :desktopApp:run
./gradlew -p samples/kmp-presentation-layer :androidApp:assembleDebug
./gradlew -p samples/kmp-presentation-layer :sharedPresentation:assemble
```

## iOS

```sh
./gradlew -p samples/kmp-presentation-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework in Xcode.
