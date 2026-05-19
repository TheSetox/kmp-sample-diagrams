# KMP Data Layer

        Shared data layer used by platform-specific UI and presentation.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared data KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/kmp-data-layer :desktopApp:run
        ./gradlew -p samples/kmp-data-layer :androidApp:assembleDebug
        ./gradlew -p samples/kmp-data-layer :sharedData:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/kmp-data-layer :sharedData:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
