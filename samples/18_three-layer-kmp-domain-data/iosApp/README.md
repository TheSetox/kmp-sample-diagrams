# iOS App

SwiftUI source for the `Three Layer KMP Domain And Data` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/18_three-layer-kmp-domain-data :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedDomain.
