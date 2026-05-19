# iOS App

SwiftUI source for the `Three Layer KMP Domain Simple` sample.

Build the KMP framework or frameworks before wiring the files into an Xcode app target:

```sh
./gradlew -p samples/three-layer-kmp-domain-simple :sharedDomain:linkDebugFrameworkIosSimulatorArm64
```

Swift files import: SharedDomain.
