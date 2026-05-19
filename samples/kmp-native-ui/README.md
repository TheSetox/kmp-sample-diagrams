# KMP Native UI

        Shared Kotlin logic with native UI per platform.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedLogic` | Shared logic KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/kmp-native-ui :desktopApp:run
        ./gradlew -p samples/kmp-native-ui :androidApp:assembleDebug
        ./gradlew -p samples/kmp-native-ui :sharedLogic:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/kmp-native-ui :sharedLogic:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
