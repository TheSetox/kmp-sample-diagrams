# KMP UI Layer

        Shared Compose UI with platform-specific presentation and data.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedUI` | Shared ui KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/kmp-ui-layer :desktopApp:run
        ./gradlew -p samples/kmp-ui-layer :androidApp:assembleDebug
        ./gradlew -p samples/kmp-ui-layer :sharedUI:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/kmp-ui-layer :sharedUI:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
