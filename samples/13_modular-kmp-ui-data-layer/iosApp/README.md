# iOS App

            SwiftUI source for the `Modular KMP UI And Data Layers` sample.

            Build the KMP framework or frameworks before wiring the files into an Xcode app target:

            ```sh
            ./gradlew -p samples/13_modular-kmp-ui-data-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/13_modular-kmp-ui-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
            ```

            Swift files import: FeatureTwoSharedUI, FeatureTwoSharedData.
