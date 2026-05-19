# iOS App

SwiftUI source for the `KMP Data Layer` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/kmp-data-layer :sharedData:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedData.
