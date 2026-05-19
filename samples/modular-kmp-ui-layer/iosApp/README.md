# iOS App

SwiftUI source for the `Modular KMP UI Layer` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/modular-kmp-ui-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: FeatureTwoSharedUI.
