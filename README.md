# KMP Sample Diagrams

Kotlin Multiplatform architecture diagrams and runnable sample projects updated for the 2026 KMP default structure and AGP 9.

The old PNG diagrams are preserved on the `feature/legacy-png-reference` branch. This branch keeps the refreshed version reviewable without losing the previous reference material.

## What Changed

- Diagrams are now Markdown files with Mermaid source in [`diagrams/`](diagrams/).
- [`index.html`](index.html) loads every diagram listed in [`diagrams/manifest.json`](diagrams/manifest.json).
- Samples use Android, iOS, and desktop only.
- No `webApp` and no `server` modules are included.
- Shared KMP code lives in KMP library modules. Platform entry points live in `androidApp`, `iosApp`, and `desktopApp`.
- Sample projects now implement the diagram flows with deterministic `Task` / `Details` demo data instead of placeholder messages.

## Versions

| Tool | Version |
| --- | --- |
| Android Gradle Plugin | `9.2.0` |
| Gradle | `9.4.1` |
| Kotlin | `2.3.21` |
| Compose Multiplatform | `1.11.0` |
| JDK | `17` |

## Diagram Viewer

Open [`index.html`](index.html) directly in a browser, or serve the repository root with any static HTTP server:

```sh
python3 -m http.server 8000
```

When served over HTTP, the viewer loads Markdown files from [`diagrams/`](diagrams/). When opened directly from `file://`, it falls back to [`diagrams/bundle.js`](diagrams/bundle.js), because browsers block `fetch()` for local Markdown files.

## Scenarios

| Scenario | Diagram | Sample |
| --- | --- | --- |
| Normal Native | [`01-normal-native.md`](diagrams/01-normal-native.md) | [`samples/01_normal-native`](samples/01_normal-native/) |
| KMP Native UI | [`02-kmp-native-ui.md`](diagrams/02-kmp-native-ui.md) | [`samples/02_kmp-native-ui`](samples/02_kmp-native-ui/) |
| KMP Compose UI | [`03-kmp-compose-ui.md`](diagrams/03-kmp-compose-ui.md) | [`samples/03_kmp-compose-ui`](samples/03_kmp-compose-ui/) |
| Layered Native | [`04-layered-native.md`](diagrams/04-layered-native.md) | [`samples/04_layered-native`](samples/04_layered-native/) |
| KMP Data Layer | [`05-kmp-data-layer.md`](diagrams/05-kmp-data-layer.md) | [`samples/05_kmp-data-layer`](samples/05_kmp-data-layer/) |
| KMP Presentation Layer | [`06-kmp-presentation-layer.md`](diagrams/06-kmp-presentation-layer.md) | [`samples/06_kmp-presentation-layer`](samples/06_kmp-presentation-layer/) |
| KMP UI Layer | [`07-kmp-ui-layer.md`](diagrams/07-kmp-ui-layer.md) | [`samples/07_kmp-ui-layer`](samples/07_kmp-ui-layer/) |
| KMP Presentation And Data Layers | [`08-kmp-presentation-data-layer.md`](diagrams/08-kmp-presentation-data-layer.md) | [`samples/08_kmp-presentation-data-layer`](samples/08_kmp-presentation-data-layer/) |
| Modular Native | [`09-modular-native.md`](diagrams/09-modular-native.md) | [`samples/09_modular-native`](samples/09_modular-native/) |
| Modular KMP Data Layer | [`10-modular-kmp-data-layer.md`](diagrams/10-modular-kmp-data-layer.md) | [`samples/10_modular-kmp-data-layer`](samples/10_modular-kmp-data-layer/) |
| Modular KMP Presentation Layer | [`11-modular-kmp-presentation-layer.md`](diagrams/11-modular-kmp-presentation-layer.md) | [`samples/11_modular-kmp-presentation-layer`](samples/11_modular-kmp-presentation-layer/) |
| Modular KMP UI Layer | [`12-modular-kmp-ui-layer.md`](diagrams/12-modular-kmp-ui-layer.md) | [`samples/12_modular-kmp-ui-layer`](samples/12_modular-kmp-ui-layer/) |
| Modular KMP UI And Data Layers | [`13-modular-kmp-ui-data-layer.md`](diagrams/13-modular-kmp-ui-data-layer.md) | [`samples/13_modular-kmp-ui-data-layer`](samples/13_modular-kmp-ui-data-layer/) |
| Modular KMP Shared Feature | [`14-modular-kmp-shared-feature.md`](diagrams/14-modular-kmp-shared-feature.md) | [`samples/14_modular-kmp-shared-feature`](samples/14_modular-kmp-shared-feature/) |
| Three Layer Native | [`15-three-layer-native.md`](diagrams/15-three-layer-native.md) | [`samples/15_three-layer-native`](samples/15_three-layer-native/) |
| Three Layer KMP Domain | [`16-three-layer-kmp-domain.md`](diagrams/16-three-layer-kmp-domain.md) | [`samples/16_three-layer-kmp-domain`](samples/16_three-layer-kmp-domain/) |
| Three Layer KMP Domain And Data | [`18-three-layer-kmp-domain-data.md`](diagrams/18-three-layer-kmp-domain-data.md) | [`samples/18_three-layer-kmp-domain-data`](samples/18_three-layer-kmp-domain-data/) |
| Three Layer KMP Domain And Presentation | [`19-three-layer-kmp-domain-presentation.md`](diagrams/19-three-layer-kmp-domain-presentation.md) | [`samples/19_three-layer-kmp-domain-presentation`](samples/19_three-layer-kmp-domain-presentation/) |

See [`samples/README.md`](samples/README.md) for each sample's implemented flow and module commands. See [`samples/implementation-review.html`](samples/implementation-review.html) or [`samples/IMPLEMENTATION_REVIEW.md`](samples/IMPLEMENTATION_REVIEW.md) for the per-module review map, and [`TESTING.md`](TESTING.md) for the latest local verification notes.

## AGP 9 KMP Rules Used Here

- Android app entry points are standalone `com.android.application` modules.
- Android app modules rely on AGP built-in Kotlin instead of applying `org.jetbrains.kotlin.android`.
- KMP library modules apply `org.jetbrains.kotlin.multiplatform` and `com.android.kotlin.multiplatform.library`.
- KMP library Android targets are configured inside the Kotlin DSL with `android { ... }`.

## References

- [JetBrains: A New Default Project Structure for Kotlin Multiplatform](https://blog.jetbrains.com/kotlin/2026/05/new-kmp-default-structure/)
- [Android Gradle Plugin release notes](https://developer.android.com/build/releases/gradle-plugin)
- [Android-KMP library plugin](https://developer.android.com/kotlin/multiplatform/plugin)
- [AGP built-in Kotlin](https://developer.android.com/build/migrate-to-built-in-kotlin)
- [Kotlin releases](https://kotlinlang.org/docs/releases.html)
- [Compose Multiplatform 1.11.0](https://blog.jetbrains.com/kotlin/2026/05/compose-multiplatform-1-11-0/)
