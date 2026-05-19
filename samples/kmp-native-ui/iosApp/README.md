# iOS App

SwiftUI source for the `KMP Native UI` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/kmp-native-ui :sharedLogic:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedLogic.
