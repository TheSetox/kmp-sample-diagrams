# Three Layer KMP Domain And Data

Shared domain and data in KMP. Each app target keeps native UI and ViewModel classes.

## Modules

| Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared Repository and DataSource KMP library. |
| `sharedDomain` | Shared UseCase, Entity, and Repository contract KMP library. |

## Run

```sh
./gradlew -p samples/three-layer-kmp-domain-data :desktopApp:run
./gradlew -p samples/three-layer-kmp-domain-data :androidApp:assembleDebug
./gradlew -p samples/three-layer-kmp-domain-data :sharedData:assemble
./gradlew -p samples/three-layer-kmp-domain-data :sharedDomain:assemble
```

## iOS

```sh
./gradlew -p samples/three-layer-kmp-domain-data :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
