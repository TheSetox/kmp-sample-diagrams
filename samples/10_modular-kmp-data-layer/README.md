# Modular KMP Data Layer

Feature one is rendered natively in every app target. Feature two keeps native ViewModels while sharing only its KMP data layer.

## Implemented Flow

- Feature One native flow on Android and Desktop: `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One native flow on iOS: `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature One UI and logic are kept out of the app entry root: Android and Desktop use `featureone` packages, and iOS uses `Sources/FeatureOne`.
- Feature Two native `DetailsViewModel` calls `featureTwoSharedData`.
- `featureTwoSharedData` owns `DetailsRepository -> RemoteDetailsDataSource / LocalDetailsDataSource -> DetailsDtoMapper`.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedData` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/10_modular-kmp-data-layer :desktopApp:compileKotlin
./gradlew -p samples/10_modular-kmp-data-layer :androidApp:assembleDebug
./gradlew -p samples/10_modular-kmp-data-layer :featureTwoSharedData:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/10_modular-kmp-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
```

Open `iosApp/iosApp.xcodeproj` and run the shared `iosApp` scheme. Its `Build KMP Frameworks` phase builds and copies the required framework automatically.
