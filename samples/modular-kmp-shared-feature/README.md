# Modular KMP Shared Feature

Feature one is rendered natively in every app target. Feature two is fully owned by one shared KMP feature module.

## Implemented Flow

- Feature One native flow on Android, iOS, and Desktop: `HomeViewModel -> TaskRepository -> TaskDataSource`.
- `featureTwoSharedFeature` owns `App -> DetailsScreen -> DetailsViewModel -> DetailsRepository -> DetailsDataSource`.
- Native apps render Feature One outside the shared Feature Two UI; no Feature One state is passed into KMP.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedFeature` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/modular-kmp-shared-feature :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-shared-feature :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-shared-feature :featureTwoSharedFeature:compileKotlinDesktop
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-shared-feature :featureTwoSharedFeature:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
