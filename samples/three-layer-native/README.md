# Three Layer Native

        Platform-specific UI, domain, and data layers.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |

        ## Run

        ```sh
        ./gradlew -p samples/three-layer-native :desktopApp:run
        ./gradlew -p samples/three-layer-native :androidApp:assembleDebug
        # No KMP module in this baseline sample.
        ```

        ## iOS

        ```sh
        # No KMP framework task in this baseline sample.
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
