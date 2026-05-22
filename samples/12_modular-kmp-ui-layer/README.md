# Modular KMP UI Layer

Feature one is rendered natively in every app target. Feature two shares Compose UI only while behavior stays native.

## Implemented Flow

- Feature One native flow on Android and Desktop: `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One native flow on iOS: `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One UI and logic are kept out of the app entry root: Android and Desktop use `featureone` packages, and iOS uses `Sources/FeatureOne`.
- Feature Two native flow is `DetailsViewModel -> DetailsRepository -> DetailsDataSource`.
- `featureTwoSharedUI` owns `App -> DetailsScreen -> DetailsUiState` and receives state/events from native ViewModels.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedUI` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/12_modular-kmp-ui-layer :desktopApp:compileKotlin
./gradlew -p samples/12_modular-kmp-ui-layer :androidApp:assembleDebug
./gradlew -p samples/12_modular-kmp-ui-layer :featureTwoSharedUI:compileKotlinDesktop
```

## iOS Frameworks

```sh
./gradlew -p samples/12_modular-kmp-ui-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
