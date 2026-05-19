# Modular KMP Presentation Layer

        Feature two shares its presentation layer as a KMP module.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedPresentation` | Shared feature two presentation KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/modular-kmp-presentation-layer :desktopApp:run
        ./gradlew -p samples/modular-kmp-presentation-layer :androidApp:assembleDebug
        ./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/modular-kmp-presentation-layer :featureTwoSharedPresentation:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
