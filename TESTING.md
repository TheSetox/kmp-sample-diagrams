# Verification Notes

Verification run on May 19, 2026 from `feature/kmp-2026-mermaid-samples`.

## Static Checks

- `diagrams/manifest.json` parses as valid JSON.
- Manifest contains 19 entries.
- Every manifest diagram file exists.
- Every manifest sample folder exists.
- The review branch has no root `*.png` files.
- `feature/legacy-png-reference` exists and preserves the old PNG files.

## Viewer Check

Served the repository root with:

```sh
python3 -m http.server 8000
```

Opened `http://127.0.0.1:8000/index.html` in the in-app browser. The viewer loaded:

- 19 diagram cards
- 19 Mermaid-rendered SVG diagrams
- 19 sidebar links
- no viewer error state

Forced the bundled fallback with `http://127.0.0.1:8000/index.html?source=bundle`. The viewer loaded:

- 19 diagram cards
- 19 Mermaid-rendered SVG diagrams
- 19 sidebar links
- no viewer error state
- `data-diagram-source="bundle"`

The in-app browser blocks direct `file://` navigation by policy, so the fallback path was verified through the explicit bundle source switch. The same bundle is loaded by `index.html` as a local script for direct browser opens.

## Gradle Checks

```sh
./gradlew --version
./gradlew -p samples/normal-native tasks
./gradlew -p samples/normal-native :desktopApp:compileKotlin
./gradlew -p samples/kmp-native-ui tasks
./gradlew -p samples/kmp-native-ui :sharedLogic:linkDebugFrameworkIosSimulatorArm64
./gradlew -p samples/kmp-compose-ui tasks
./gradlew -p samples/kmp-compose-ui :shared:compileKotlinDesktop :desktopApp:compileKotlin
./gradlew -p samples/modular-kmp-ui-data-layer tasks
./gradlew -p samples/three-layer-kmp-domain-data tasks
```

All commands above completed successfully.

## Local Tooling Limit

Android assemble was attempted with:

```sh
./gradlew -p samples/kmp-compose-ui :androidApp:assembleDebug
```

It was blocked because this machine does not expose an Android SDK through `ANDROID_HOME` or `local.properties`.

Compose Multiplatform 1.11.0 resolved cleanly for `iosArm64` and `iosSimulatorArm64`. The samples intentionally omit `iosX64` to avoid unsupported Compose iOS x64 resolution.
