# Modular KMP UI And Data Layers

        Feature two shares UI and data as separate KMP modules.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `featureTwoSharedData` | Shared feature two data KMP library. |
| `featureTwoSharedUI` | Shared feature two ui KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/modular-kmp-ui-data-layer :desktopApp:run
        ./gradlew -p samples/modular-kmp-ui-data-layer :androidApp:assembleDebug
        ./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedData:assemble
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedUI:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedUI:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/modular-kmp-ui-data-layer :featureTwoSharedData:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
