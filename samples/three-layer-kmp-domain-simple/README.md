# Three Layer KMP Domain Simple

        Minimal shared domain layer consumed directly by every app.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |
| `sharedDomain` | Shared domain KMP library. |

        ## Run

        ```sh
        ./gradlew -p samples/three-layer-kmp-domain-simple :desktopApp:run
        ./gradlew -p samples/three-layer-kmp-domain-simple :androidApp:assembleDebug
        ./gradlew -p samples/three-layer-kmp-domain-simple :sharedDomain:assemble
        ```

        ## iOS

        ```sh
        ./gradlew -p samples/three-layer-kmp-domain-simple :sharedDomain:linkDebugFrameworkIosSimulatorArm64
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
