# Normal Native

Separate native implementations with no shared KMP module.

## Implemented Flow

- Android: `MainActivity` renders native UI and calls `HomeViewModel -> TaskRepository -> TaskDataSource`.
- iOS: `ContentView.swift` calls `HomeViewModel -> TaskRepository -> TaskDataSource`.
- Desktop: `Main.kt` renders Compose Desktop UI and calls `HomeViewModel -> TaskRepository -> TaskDataSource`.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |

## Verify

```sh
./gradlew -p samples/01_normal-native :desktopApp:compileKotlin
./gradlew -p samples/01_normal-native :androidApp:assembleDebug
```

## iOS Frameworks

This baseline sample has no KMP framework task. Open `iosApp/iosApp.xcodeproj` and run the shared `iosApp` scheme.
