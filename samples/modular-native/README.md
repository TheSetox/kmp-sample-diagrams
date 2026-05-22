# Modular Native

Feature one and feature two are implemented separately on every platform.

## Implemented Flow

- Feature one: native `HomeViewModel -> TaskRepository -> TaskDataSource`.
- Feature two: native `DetailsViewModel -> DetailsRepository -> DetailsDataSource`.
- Android, iOS, and Desktop each keep their own feature implementations.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |

## Verify

```sh
./gradlew -p samples/modular-native :desktopApp:compileKotlin
./gradlew -p samples/modular-native :androidApp:assembleDebug
```

## iOS Frameworks

This baseline sample has no KMP framework task. The `iosApp` folder contains SwiftUI entry source.
