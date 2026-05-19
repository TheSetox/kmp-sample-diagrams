# Three Layer KMP Domain And Data

        Shared domain and data layers with platform-specific UI.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedData` | Shared data KMP library. |
| `sharedDomain` | Shared domain KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/three-layer-kmp-domain-data :desktopApp:run
        ./gradlew -p samples/three-layer-kmp-domain-data :androidApp:assembleDebug
        ./gradlew -p samples/three-layer-kmp-domain-data :sharedData:assemble
./gradlew -p samples/three-layer-kmp-domain-data :sharedDomain:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/three-layer-kmp-domain-data :sharedDomain:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
