# iOS App

Open `iosApp.xcodeproj` in Xcode and run the shared `iosApp` scheme on an iOS simulator.

This is a real SwiftUI application target for the `Modular KMP UI And Data Layers` sample. The target compiles every Swift file under `Sources/` and links the KMP framework or frameworks listed below.

The Xcode target includes a `Build KMP Frameworks` phase, so running from Xcode builds and copies: FeatureTwoSharedUI, FeatureTwoSharedData.

Equivalent framework tasks:

```sh
./gradlew -p samples/13_modular-kmp-ui-data-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/13_modular-kmp-ui-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
```
