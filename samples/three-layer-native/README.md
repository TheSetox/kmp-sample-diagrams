# Three Layer Native

Every platform owns its own presentation, domain, and data layers.

## Implemented Flow

- Presentation: native UI calls `HomeViewModel`.
- Domain: `HomeViewModel` calls `GetTasksUseCase` and uses the `Task` entity.
- Data: `TaskRepository -> TaskDataSource` supplies deterministic task details.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |

## Verify

```sh
./gradlew -p samples/three-layer-native :desktopApp:compileKotlin
./gradlew -p samples/three-layer-native :androidApp:assembleDebug
```

## iOS Frameworks

This baseline sample has no KMP framework task. The `iosApp` folder contains SwiftUI entry source.
