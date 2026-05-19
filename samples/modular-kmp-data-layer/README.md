# Modular KMP Data Layer

        Feature two shares its data layer as a KMP module.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedData` | Shared feature two data KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/modular-kmp-data-layer :desktopApp:run
        ./gradlew -p samples/modular-kmp-data-layer :androidApp:assembleDebug
        ./gradlew -p samples/modular-kmp-data-layer :featureTwoSharedData:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/modular-kmp-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
