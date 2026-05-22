# iOS App

Open `iosApp.xcodeproj` in Xcode and run the shared `iosApp` scheme on an iOS simulator.

This is a real SwiftUI application target for the `Three Layer KMP Domain` sample. The target compiles every Swift file under `Sources/` and links the KMP framework or frameworks listed below.

The Xcode target includes a `Build KMP Frameworks` phase, so running from Xcode builds and copies: SharedDomain.

Equivalent framework task:

```sh
./gradlew -p samples/16_three-layer-kmp-domain :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```
