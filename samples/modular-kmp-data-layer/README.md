# Modular KMP Data Layer

Feature two uses shared data while feature one remains native.

## Implemented Flow

- Feature one stays native on Android, iOS, and Desktop.
- Feature two native `DetailsViewModel` calls `featureTwoSharedData`.
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
./gradlew -p samples/modular-kmp-data-layer :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-data-layer :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-data-layer :featureTwoSharedData:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
