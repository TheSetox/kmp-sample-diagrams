# Modular KMP Presentation Layer

Feature two has shared Compose presentation with native data implementations.

## Implemented Flow

- Feature one stays native on Android, iOS, and Desktop.
- `featureTwoSharedPresentation` owns `App`, `DetailsUiState`, and `DetailsViewModel`.
- Android, iOS, and Desktop implement the feature-two repository contract natively.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedPresentation` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/modular-kmp-presentation-layer :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-presentation-layer :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
