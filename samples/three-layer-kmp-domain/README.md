# Three Layer KMP Domain

Shared domain in KMP. Each app target keeps native UI, ViewModel, Repository implementation, and DataSource classes.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedDomain` | Shared UseCase, Entity, and Repository contract KMP library. |

## Run

```sh
./gradlew -p samples/three-layer-kmp-domain :desktopApp:run
./gradlew -p samples/three-layer-kmp-domain :androidApp:assembleDebug
./gradlew -p samples/three-layer-kmp-domain :sharedDomain:assemble
```

## iOS

```sh
./gradlew -p samples/three-layer-kmp-domain :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
