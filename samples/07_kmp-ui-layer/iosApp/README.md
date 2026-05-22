# iOS App

SwiftUI source for the `KMP UI Layer` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/07_kmp-ui-layer :sharedUI:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedUI.
