# Layered Native

Each platform separates presentation and data classes; this two-layer scenario intentionally has no use case.

## Implemented Flow

- Android: presentation `HomeViewModel` calls data `TaskRepository -> TaskDataSource`.
- iOS: `ContentView.swift` calls `HomeViewModel -> TaskRepository -> TaskDataSource`.
- Desktop: presentation `HomeViewModel` calls data `TaskRepository -> TaskDataSource`.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |

## Verify

```sh
./gradlew -p samples/layered-native :desktopApp:compileKotlin
./gradlew -p samples/layered-native :androidApp:assembleDebug
```

## iOS Frameworks

This baseline sample has no KMP framework task. The `iosApp` folder contains SwiftUI entry source.
