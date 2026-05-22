# Modular KMP Presentation Layer

Feature one is rendered natively in every app target. Feature two has shared Compose presentation with native data implementations.

## Implemented Flow

- Feature One native flow on Android and Desktop: `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One native flow on iOS: `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One UI and logic are kept out of the app entry root: Android and Desktop use `featureone` packages, and iOS uses `Sources/FeatureOne`.
- `featureTwoSharedPresentation` owns `App -> DetailsScreen -> DetailsViewModel -> DetailsUiState` and the `DetailsRepository` contract.
- Android, iOS, and Desktop implement the feature-two repository contract with native `DetailsDataSource` classes.

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
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:compileKotlinDesktop
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
