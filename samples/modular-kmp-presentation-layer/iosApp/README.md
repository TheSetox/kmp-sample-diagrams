# iOS App

SwiftUI source for the `Modular KMP Presentation Layer` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: FeatureTwoSharedPresentation.
