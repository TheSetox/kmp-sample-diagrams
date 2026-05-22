# Modular KMP UI And Data Layers

Feature two shares Compose UI and data while the ViewModel remains native.

## Implemented Flow

- Feature one stays native on Android, iOS, and Desktop.
- Feature two native `DetailsViewModel` calls `featureTwoSharedData` and passes state to `featureTwoSharedUI`.
- `featureTwoSharedData` owns repository/data sources; `featureTwoSharedUI` owns state and UI callbacks.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedData` | Shared KMP module for this scenario. |
| `featureTwoSharedUI` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/modular-kmp-ui-data-layer :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-ui-data-layer :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedData:assemble
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedUI:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
