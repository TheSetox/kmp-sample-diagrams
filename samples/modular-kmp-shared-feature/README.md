# Modular KMP Shared Feature

Feature two is fully shared as a KMP feature module.

## Implemented Flow

- Feature one stays native and passes a summary into the shared feature.
- `featureTwoSharedFeature` owns `App -> DetailsViewModel -> DetailsRepository -> DetailsDataSource`.
- Android, iOS, and Desktop host the shared feature-two entry point.

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
./gradlew -p samples/modular-kmp-shared-feature :featureTwoSharedFeature:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-shared-feature :featureTwoSharedFeature:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
