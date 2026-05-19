# KMP Presentation Layer

        Shared presentation state and actions with platform-specific UI and data.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedPresentation` | Shared presentation KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/kmp-presentation-layer :desktopApp:run
        ./gradlew -p samples/kmp-presentation-layer :androidApp:assembleDebug
        ./gradlew -p samples/kmp-presentation-layer :sharedPresentation:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/kmp-presentation-layer :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
