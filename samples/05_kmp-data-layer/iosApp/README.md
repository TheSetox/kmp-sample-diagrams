# iOS App

Open `iosApp.xcodeproj` in Xcode and run the shared `iosApp` scheme on an iOS simulator.

This is a real SwiftUI application target for the `KMP Data Layer` sample. The target compiles every Swift file under `Sources/` and links the KMP framework or frameworks listed below.

The Xcode target includes a `Build KMP Frameworks` phase, so running from Xcode builds and copies: SharedData.

Equivalent framework task:

```sh
./gradlew -p samples/05_kmp-data-layer :sharedData:linkDebugFrameworkIosSimulatorArm64
```
