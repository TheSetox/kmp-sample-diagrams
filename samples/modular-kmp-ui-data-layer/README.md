# Modular KMP UI And Data Layers

Feature one is rendered natively in every app target. Feature two shares Compose UI and KMP data while native ViewModels wire them together.

## Implemented Flow

- Feature One native flow on Android and Desktop: `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One native flow on iOS: `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One UI and logic are kept out of the app entry root: Android and Desktop use `featureone` packages, and iOS uses `Sources/FeatureOne`.
- Feature Two native `DetailsViewModel` calls shared data and passes state/events to shared UI.
- `featureTwoSharedUI` owns `App -> DetailsScreen -> DetailsUiState`; `featureTwoSharedData` owns repository/data sources/mapper.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedUI` | Shared KMP module for this scenario. |
| `featureTwoSharedData` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/modular-kmp-ui-data-layer :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-ui-data-layer :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedData:assemble
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedUI:compileKotlinDesktop
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
