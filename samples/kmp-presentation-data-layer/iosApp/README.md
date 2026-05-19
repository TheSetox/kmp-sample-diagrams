# iOS App

SwiftUI source for the `KMP Presentation And Data Layers` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/kmp-presentation-data-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedPresentation.
