# Modular KMP UI Layer

        Feature two shares Compose UI while platform apps keep presentation and data.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedUI` | Shared feature two ui KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/modular-kmp-ui-layer :desktopApp:run
        ./gradlew -p samples/modular-kmp-ui-layer :androidApp:assembleDebug
        ./gradlew -p samples/modular-kmp-ui-layer :featureTwoSharedUI:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/modular-kmp-ui-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
