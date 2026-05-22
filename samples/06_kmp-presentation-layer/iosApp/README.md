# iOS App

SwiftUI source for the `KMP Presentation Layer` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/06_kmp-presentation-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedPresentation.
