# KMP Presentation And Data Layers

Shared presentation and data in KMP. Presentation owns the Compose UI and ViewModel; data owns the shared Repository and DataSource.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared Repository and DataSource KMP library. |
| `sharedPresentation` | Shared Compose UI and ViewModel KMP library. |

## Run

```sh
./gradlew -p samples/kmp-presentation-data-layer :desktopApp:run
./gradlew -p samples/kmp-presentation-data-layer :androidApp:assembleDebug
./gradlew -p samples/kmp-presentation-data-layer :sharedData:assemble
./gradlew -p samples/kmp-presentation-data-layer :sharedPresentation:assemble
```

## iOS

```sh
./gradlew -p samples/kmp-presentation-data-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
