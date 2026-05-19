# Modular KMP Presentation Layer

Feature two shares presentation with Compose UI and ViewModel in KMP. Repository and data source implementations stay native.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedPresentation` | Shared feature-two Compose UI and ViewModel KMP library. |

## Run

```sh
./gradlew -p samples/modular-kmp-presentation-layer :desktopApp:run
./gradlew -p samples/modular-kmp-presentation-layer :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:assemble
```

## iOS

```sh
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework in Xcode.
