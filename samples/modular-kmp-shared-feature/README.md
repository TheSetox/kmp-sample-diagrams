# Modular KMP Shared Feature

        Feature two is one shared KMP feature module.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedFeature` | Shared feature two full feature KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/modular-kmp-shared-feature :desktopApp:run
        ./gradlew -p samples/modular-kmp-shared-feature :androidApp:assembleDebug
        ./gradlew -p samples/modular-kmp-shared-feature :featureTwoSharedFeature:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/modular-kmp-shared-feature :featureTwoSharedFeature:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
