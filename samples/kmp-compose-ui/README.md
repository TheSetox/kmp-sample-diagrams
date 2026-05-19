# KMP Compose UI

        Shared Compose UI and shared logic in one KMP library.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `shared` | Shared shared ui and logic KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/kmp-compose-ui :desktopApp:run
        ./gradlew -p samples/kmp-compose-ui :androidApp:assembleDebug
        ./gradlew -p samples/kmp-compose-ui :shared:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/kmp-compose-ui :shared:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
