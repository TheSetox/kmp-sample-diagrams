# iOS App

SwiftUI source for the `Three Layer KMP Domain` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/16_three-layer-kmp-domain :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedDomain.
