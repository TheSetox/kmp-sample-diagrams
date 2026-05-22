# Modular KMP UI Layer

Feature two shares Compose UI while feature behavior stays native.

## Implemented Flow

- Feature one stays native on Android, iOS, and Desktop.
- `featureTwoSharedUI` exposes `DetailsUiState`, `App(state, onRefresh)`, and the iOS `MainViewController(...)` factory.
- Native feature-two `DetailsViewModel -> DetailsRepository -> DetailsDataSource` passes state and callbacks into shared UI.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedUI` | Shared KMP module for this scenario. |

## Verify

```sh
./gradlew -p samples/modular-kmp-ui-layer :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-ui-layer :androidApp:assembleDebug
./gradlew -p samples/modular-kmp-ui-layer :featureTwoSharedUI:assemble
```

## iOS Frameworks

```sh
./gradlew -p samples/modular-kmp-ui-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
