# Three Layer KMP Domain And Presentation

        Shared domain and presentation layers with platform-specific data.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedDomain` | Shared domain KMP library. |
| `sharedPresentation` | Shared presentation KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/three-layer-kmp-domain-presentation :desktopApp:run
        ./gradlew -p samples/three-layer-kmp-domain-presentation :androidApp:assembleDebug
        ./gradlew -p samples/three-layer-kmp-domain-presentation :sharedDomain:assemble
./gradlew -p samples/three-layer-kmp-domain-presentation :sharedPresentation:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/three-layer-kmp-domain-presentation :sharedPresentation:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
