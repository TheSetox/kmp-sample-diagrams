# iOS App

SwiftUI source for the `Modular KMP Data Layer` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/modular-kmp-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: FeatureTwoSharedData.
