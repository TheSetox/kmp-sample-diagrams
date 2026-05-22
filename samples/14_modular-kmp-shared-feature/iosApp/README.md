# iOS App

SwiftUI source for the `Modular KMP Shared Feature` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/14_modular-kmp-shared-feature :featureTwoSharedFeature:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: FeatureTwoSharedFeature.
