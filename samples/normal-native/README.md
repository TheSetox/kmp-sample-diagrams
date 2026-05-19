# Normal Native

        Separate native implementations with no shared KMP module.

        ## Modules

        | Module | Purpose |
| --- | --- |
| `androidApp` | Android application entry point. |
| `desktopApp` | Desktop application entry point. |
| `iosApp` | SwiftUI source for the iOS entry point. |

        ## Run

        ```sh
        ./gradlew -p samples/normal-native :desktopApp:run
        ./gradlew -p samples/normal-native :androidApp:assembleDebug
        # No KMP module in this baseline sample.
        ```

        ## iOS

        ```sh
        # No KMP framework task in this baseline sample.
        ```

        The `iosApp` folder contains SwiftUI entry source and notes for connecting the generated framework or frameworks in Xcode.
