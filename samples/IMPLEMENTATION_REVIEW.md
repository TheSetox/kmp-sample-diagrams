# Sample Implementation Review

This review maps every diagram scenario to the current sample code in this repository. It is intended as a reading guide for code review: start with the module row, then open the linked module folder.

## Validation Summary

- Review date: August 21, 2026.
- Target branch: `main`.
- All 18 samples have `androidApp`, `desktopApp`, and a real SwiftUI `iosApp.xcodeproj` with the shared `iosApp` scheme.
- Static scan found no stale placeholder message classes, sample-detail helpers, or todo/fixme markers.
- Android app Gradle files do not apply `org.jetbrains.kotlin.android`; they rely on AGP built-in Kotlin.
- Build verification details are recorded in [../TESTING.md](../TESTING.md).

## Review Findings

No blocking architecture mismatches were found in this pass. The iOS apps are now runnable Xcode projects; KMP-backed projects build their Kotlin/Native frameworks from an Xcode shell phase before Swift compilation.

## Baseline

### normal-native

- Sample: [`01_normal-native`](01_normal-native/)
- Diagram: [`01-normal-native.md`](../diagrams/01-normal-native.md)
- Verdict: Matches: each platform has its own direct UI -> ViewModel -> Repository -> DataSource flow.

| Module | How It Works |
| --- | --- |
| [`androidApp`](01_normal-native/androidApp/) | Android entry point renders a native text screen and calls `HomeViewModel -> TaskRepository -> TaskDataSource` in Android code. |
| [`iosApp`](01_normal-native/iosApp/) | SwiftUI `ContentView` calls native Swift `HomeViewModel -> TaskRepository -> TaskDataSource`. |
| [`desktopApp`](01_normal-native/desktopApp/) | Compose Desktop window calls desktop `HomeViewModel -> TaskRepository -> TaskDataSource`. |

### layered-native

- Sample: [`04_layered-native`](04_layered-native/)
- Diagram: [`04-layered-native.md`](../diagrams/04-layered-native.md)
- Verdict: Matches: presentation and data are separated per platform, with no use case layer.

| Module | How It Works |
| --- | --- |
| [`androidApp`](04_layered-native/androidApp/) | `presentation/HomeViewModel` calls `data/TaskRepository -> TaskDataSource`; `MainActivity` owns the Android entry point. |
| [`iosApp`](04_layered-native/iosApp/) | SwiftUI `ContentView` calls Swift `HomeViewModel -> TaskRepository -> TaskDataSource`. |
| [`desktopApp`](04_layered-native/desktopApp/) | `presentation/HomeViewModel` calls `data/TaskRepository -> TaskDataSource`; `Main.kt` owns the desktop entry point. |

### modular-native

- Sample: [`09_modular-native`](09_modular-native/)
- Diagram: [`09-modular-native.md`](../diagrams/09-modular-native.md)
- Verdict: Matches: feature one and feature two are duplicated per platform as native modules/packages.

| Module | How It Works |
| --- | --- |
| [`androidApp`](09_modular-native/androidApp/) | `featureone/HomeViewModel -> TaskRepository -> TaskDataSource` and `featuretwo/DetailsViewModel -> DetailsRepository -> DetailsDataSource`. |
| [`iosApp`](09_modular-native/iosApp/) | SwiftUI hosts Swift feature-one task classes and feature-two details classes. |
| [`desktopApp`](09_modular-native/desktopApp/) | Desktop packages mirror Android: `featureone` for task summary and `featuretwo` for details. |

### three-layer-native

- Sample: [`15_three-layer-native`](15_three-layer-native/)
- Diagram: [`15-three-layer-native.md`](../diagrams/15-three-layer-native.md)
- Verdict: Matches: every platform owns presentation, domain, and data classes.

| Module | How It Works |
| --- | --- |
| [`androidApp`](15_three-layer-native/androidApp/) | `presentation/HomeViewModel -> domain/GetTasksUseCase -> data/TaskRepository -> TaskDataSource`, with `Task` in domain. |
| [`iosApp`](15_three-layer-native/iosApp/) | SwiftUI calls Swift `HomeViewModel -> GetTasksUseCase -> TaskRepository -> TaskDataSource`, with Swift `Task` entity. |
| [`desktopApp`](15_three-layer-native/desktopApp/) | Desktop mirrors Android with presentation, domain, and data packages. |

## Main KMP

### kmp-native-ui

- Sample: [`02_kmp-native-ui`](02_kmp-native-ui/)
- Diagram: [`02-kmp-native-ui.md`](../diagrams/02-kmp-native-ui.md)
- Verdict: Matches: platform UI is native while the ViewModel, use case, repository, and data source are shared.

| Module | How It Works |
| --- | --- |
| [`androidApp`](02_kmp-native-ui/androidApp/) | `MainActivity` creates the shared `HomeViewModel` and displays its state in Android UI. |
| [`iosApp`](02_kmp-native-ui/iosApp/) | SwiftUI `ContentView` calls the exported shared `HomeViewModel`. |
| [`desktopApp`](02_kmp-native-ui/desktopApp/) | Compose Desktop calls the shared `HomeViewModel`. |
| [`sharedLogic`](02_kmp-native-ui/sharedLogic/) | KMP flow is `HomeViewModel -> GetTasksUseCase -> TaskRepository -> TaskDataSource`. |

### kmp-compose-ui

- Sample: [`03_kmp-compose-ui`](03_kmp-compose-ui/)
- Diagram: [`03-kmp-compose-ui.md`](../diagrams/03-kmp-compose-ui.md)
- Verdict: Matches the corrected intent: UI is shared, behavior is native.

| Module | How It Works |
| --- | --- |
| [`androidApp`](03_kmp-compose-ui/androidApp/) | Android owns `HomeViewModel -> TaskRepository -> TaskDataSource`, then passes `HomeUiState` and refresh callback to shared UI. |
| [`iosApp`](03_kmp-compose-ui/iosApp/) | Swift owns `HomeViewModel -> TaskRepository -> TaskDataSource`, then hosts the KMP Compose UI via `MainViewController`. |
| [`desktopApp`](03_kmp-compose-ui/desktopApp/) | Desktop owns `HomeViewModel -> TaskRepository -> TaskDataSource`, then renders shared `App(state, onRefresh)`. |
| [`shared`](03_kmp-compose-ui/shared/) | KMP UI-only surface exposes `HomeUiState`, `App(state, onRefresh)`, and iOS `MainViewController(...)`. |

### kmp-data-layer

- Sample: [`05_kmp-data-layer`](05_kmp-data-layer/)
- Diagram: [`05-kmp-data-layer.md`](../diagrams/05-kmp-data-layer.md)
- Verdict: Matches: UI and ViewModel are native, data is shared.

| Module | How It Works |
| --- | --- |
| [`androidApp`](05_kmp-data-layer/androidApp/) | Android `HomeViewModel` calls shared `TaskRepository`. |
| [`iosApp`](05_kmp-data-layer/iosApp/) | Swift `HomeViewModel` imports the shared data framework and calls shared `TaskRepository`. |
| [`desktopApp`](05_kmp-data-layer/desktopApp/) | Desktop `HomeViewModel` calls shared `TaskRepository`. |
| [`sharedData`](05_kmp-data-layer/sharedData/) | KMP data flow is `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`. |

### kmp-presentation-layer

- Sample: [`06_kmp-presentation-layer`](06_kmp-presentation-layer/)
- Diagram: [`06-kmp-presentation-layer.md`](../diagrams/06-kmp-presentation-layer.md)
- Verdict: Matches: shared presentation depends on a repository contract implemented natively.

| Module | How It Works |
| --- | --- |
| [`androidApp`](06_kmp-presentation-layer/androidApp/) | Android implements the shared `TaskRepository` contract with native `TaskDataSource`, then hosts shared `App`. |
| [`iosApp`](06_kmp-presentation-layer/iosApp/) | Swift implements the exported repository contract and hosts shared Compose UI through `MainViewController`. |
| [`desktopApp`](06_kmp-presentation-layer/desktopApp/) | Desktop implements the repository contract and hosts shared `App`. |
| [`sharedPresentation`](06_kmp-presentation-layer/sharedPresentation/) | KMP owns `App`, `HomeUiState`, `HomeViewModel`, and the `TaskRepository` contract. |

### kmp-ui-layer

- Sample: [`07_kmp-ui-layer`](07_kmp-ui-layer/)
- Diagram: [`07-kmp-ui-layer.md`](../diagrams/07-kmp-ui-layer.md)
- Verdict: Matches: only the Compose UI surface is shared.

| Module | How It Works |
| --- | --- |
| [`androidApp`](07_kmp-ui-layer/androidApp/) | Android owns `HomeViewModel -> TaskRepository -> TaskDataSource` and passes state/callbacks to `sharedUI`. |
| [`iosApp`](07_kmp-ui-layer/iosApp/) | Swift owns the ViewModel/repository/data source and passes state/callbacks into the shared UI factory. |
| [`desktopApp`](07_kmp-ui-layer/desktopApp/) | Desktop owns native-style logic and renders shared UI. |
| [`sharedUI`](07_kmp-ui-layer/sharedUI/) | KMP UI-only surface exposes `HomeUiState`, `App(state, onRefresh)`, and iOS `MainViewController(...)`. |

### kmp-presentation-data-layer

- Sample: [`08_kmp-presentation-data-layer`](08_kmp-presentation-data-layer/)
- Diagram: [`08-kmp-presentation-data-layer.md`](../diagrams/08-kmp-presentation-data-layer.md)
- Verdict: Matches: presentation and data are shared; app targets host only the entry point.

| Module | How It Works |
| --- | --- |
| [`androidApp`](08_kmp-presentation-data-layer/androidApp/) | `MainActivity` hosts shared `App(platform, repository)`. |
| [`iosApp`](08_kmp-presentation-data-layer/iosApp/) | SwiftUI hosts the shared Compose view controller. |
| [`desktopApp`](08_kmp-presentation-data-layer/desktopApp/) | Desktop hosts shared `App(platform, TaskRepository())`. |
| [`sharedPresentation`](08_kmp-presentation-data-layer/sharedPresentation/) | KMP presentation flow is `App -> HomeViewModel -> HomeUiState`, calling shared data. |
| [`sharedData`](08_kmp-presentation-data-layer/sharedData/) | KMP data flow is `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`. |

## Modular KMP

### modular-kmp-data-layer

- Sample: [`10_modular-kmp-data-layer`](10_modular-kmp-data-layer/)
- Diagram: [`10-modular-kmp-data-layer.md`](../diagrams/10-modular-kmp-data-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two uses shared KMP data.

| Module | How It Works |
| --- | --- |
| [`androidApp`](10_modular-kmp-data-layer/androidApp/) | `MainActivity` hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`, then native `DetailsViewModel` calls shared data. |
| [`iosApp`](10_modular-kmp-data-layer/iosApp/) | SwiftUI `ContentView` hosts native `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`, and native `DetailsViewModel` calls the shared data framework. |
| [`desktopApp`](10_modular-kmp-data-layer/desktopApp/) | Desktop `Main.kt` hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`, and native `DetailsViewModel` calls shared data. |
| [`featureTwoSharedData`](10_modular-kmp-data-layer/featureTwoSharedData/) | KMP owns `DetailsRepository -> RemoteDetailsDataSource / LocalDetailsDataSource -> DetailsDtoMapper`. |

### modular-kmp-presentation-layer

- Sample: [`11_modular-kmp-presentation-layer`](11_modular-kmp-presentation-layer/)
- Diagram: [`11-modular-kmp-presentation-layer.md`](../diagrams/11-modular-kmp-presentation-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two presentation is shared and data is native.

| Module | How It Works |
| --- | --- |
| [`androidApp`](11_modular-kmp-presentation-layer/androidApp/) | `MainActivity` hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`, implements native `DetailsRepository -> DetailsDataSource`, and hosts shared Feature Two presentation. |
| [`iosApp`](11_modular-kmp-presentation-layer/iosApp/) | SwiftUI hosts native `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`, implements the repository contract, and hosts shared Compose presentation. |
| [`desktopApp`](11_modular-kmp-presentation-layer/desktopApp/) | Desktop hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`, implements native Feature Two data, and hosts shared presentation. |
| [`featureTwoSharedPresentation`](11_modular-kmp-presentation-layer/featureTwoSharedPresentation/) | KMP owns `App -> DetailsScreen -> DetailsViewModel -> DetailsUiState` plus the `DetailsRepository` contract. |

### modular-kmp-ui-layer

- Sample: [`12_modular-kmp-ui-layer`](12_modular-kmp-ui-layer/)
- Diagram: [`12-modular-kmp-ui-layer.md`](../diagrams/12-modular-kmp-ui-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two UI is shared while behavior stays native.

| Module | How It Works |
| --- | --- |
| [`androidApp`](12_modular-kmp-ui-layer/androidApp/) | `MainActivity` hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource` and native Feature Two `DetailsViewModel -> DetailsRepository -> DetailsDataSource`, passing state/events to shared UI. |
| [`iosApp`](12_modular-kmp-ui-layer/iosApp/) | SwiftUI hosts native `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource` and uses native Feature Two logic with the shared UI factory. |
| [`desktopApp`](12_modular-kmp-ui-layer/desktopApp/) | Desktop hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource` and native Feature Two logic, then renders shared UI. |
| [`featureTwoSharedUI`](12_modular-kmp-ui-layer/featureTwoSharedUI/) | KMP owns `App -> DetailsScreen -> DetailsUiState` and receives native state/events. |

### modular-kmp-ui-data-layer

- Sample: [`13_modular-kmp-ui-data-layer`](13_modular-kmp-ui-data-layer/)
- Diagram: [`13-modular-kmp-ui-data-layer.md`](../diagrams/13-modular-kmp-ui-data-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two UI and data are shared with a native ViewModel bridge.

| Module | How It Works |
| --- | --- |
| [`androidApp`](13_modular-kmp-ui-data-layer/androidApp/) | `MainActivity` hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`; native `DetailsViewModel` calls shared data and passes state/events to shared UI. |
| [`iosApp`](13_modular-kmp-ui-data-layer/iosApp/) | SwiftUI hosts native `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`; native `DetailsViewModel` bridges shared UI and shared data. |
| [`desktopApp`](13_modular-kmp-ui-data-layer/desktopApp/) | Desktop hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`; native `DetailsViewModel` connects shared UI and data. |
| [`featureTwoSharedUI`](13_modular-kmp-ui-data-layer/featureTwoSharedUI/) | KMP owns `App -> DetailsScreen -> DetailsUiState`. |
| [`featureTwoSharedData`](13_modular-kmp-ui-data-layer/featureTwoSharedData/) | KMP owns `DetailsRepository -> RemoteDetailsDataSource / LocalDetailsDataSource -> DetailsDtoMapper`. |

### modular-kmp-shared-feature

- Sample: [`14_modular-kmp-shared-feature`](14_modular-kmp-shared-feature/)
- Diagram: [`14-modular-kmp-shared-feature.md`](../diagrams/14-modular-kmp-shared-feature.md)
- Verdict: Matches: Feature One is native and visible; Feature Two is fully owned by the shared KMP feature module.

| Module | How It Works |
| --- | --- |
| [`androidApp`](14_modular-kmp-shared-feature/androidApp/) | `MainActivity` hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`, then hosts shared Feature Two. |
| [`iosApp`](14_modular-kmp-shared-feature/iosApp/) | SwiftUI hosts native `FeatureOneView -> HomeViewModel -> TaskRepository -> TaskDataSource`, then hosts the shared Feature Two view controller. |
| [`desktopApp`](14_modular-kmp-shared-feature/desktopApp/) | Desktop hosts native `FeatureOneScreen -> HomeViewModel -> TaskRepository -> TaskDataSource`, then hosts shared Feature Two. |
| [`featureTwoSharedFeature`](14_modular-kmp-shared-feature/featureTwoSharedFeature/) | KMP owns `App -> DetailsScreen -> DetailsViewModel -> DetailsRepository -> DetailsDataSource`. |

## Three Layer KMP

### three-layer-kmp-domain

- Sample: [`16_three-layer-kmp-domain`](16_three-layer-kmp-domain/)
- Diagram: [`16-three-layer-kmp-domain.md`](../diagrams/16-three-layer-kmp-domain.md)
- Verdict: Matches: domain is shared and native repositories implement the shared contract.

| Module | How It Works |
| --- | --- |
| [`androidApp`](16_three-layer-kmp-domain/androidApp/) | Android owns `HomeScreen -> HomeViewModel`, plus native `TaskRepository -> TaskDataSource`. |
| [`iosApp`](16_three-layer-kmp-domain/iosApp/) | SwiftUI owns `HomeViewModel`, plus native repository/data source classes implementing the shared contract. |
| [`desktopApp`](16_three-layer-kmp-domain/desktopApp/) | Desktop owns `HomeWindow -> HomeViewModel`, plus native `TaskRepository -> TaskDataSource`. |
| [`sharedDomain`](16_three-layer-kmp-domain/sharedDomain/) | KMP owns `GetTasksUseCase`, `Task`, and the `TaskRepository` contract. |

### three-layer-kmp-domain-data

- Sample: [`18_three-layer-kmp-domain-data`](18_three-layer-kmp-domain-data/)
- Diagram: [`18-three-layer-kmp-domain-data.md`](../diagrams/18-three-layer-kmp-domain-data.md)
- Verdict: Matches: native presentation calls shared domain, and shared domain calls shared data.

| Module | How It Works |
| --- | --- |
| [`androidApp`](18_three-layer-kmp-domain-data/androidApp/) | Android owns `HomeScreen -> HomeViewModel`; ViewModel calls shared `GetTasksUseCase`. |
| [`iosApp`](18_three-layer-kmp-domain-data/iosApp/) | SwiftUI owns `HomeViewModel`; ViewModel calls shared `GetTasksUseCase`. |
| [`desktopApp`](18_three-layer-kmp-domain-data/desktopApp/) | Desktop owns `HomeWindow -> HomeViewModel`; ViewModel calls shared `GetTasksUseCase`. |
| [`sharedDomain`](18_three-layer-kmp-domain-data/sharedDomain/) | KMP owns `GetTasksUseCase` and `Task`, and depends on shared data. |
| [`sharedData`](18_three-layer-kmp-domain-data/sharedData/) | KMP owns `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`. |

### three-layer-kmp-domain-presentation

- Sample: [`19_three-layer-kmp-domain-presentation`](19_three-layer-kmp-domain-presentation/)
- Diagram: [`19-three-layer-kmp-domain-presentation.md`](../diagrams/19-three-layer-kmp-domain-presentation.md)
- Verdict: Matches: shared presentation and shared domain call native data implementations through a contract.

| Module | How It Works |
| --- | --- |
| [`androidApp`](19_three-layer-kmp-domain-presentation/androidApp/) | `MainActivity` is the Android entry point; it builds native `TaskRepository -> TaskDataSource` and passes it to shared `App`. |
| [`iosApp`](19_three-layer-kmp-domain-presentation/iosApp/) | SwiftUI `ContentView` is the iOS entry point; it builds native `TaskRepository -> TaskDataSource` and passes it to the shared Compose view controller. |
| [`desktopApp`](19_three-layer-kmp-domain-presentation/desktopApp/) | Desktop `Main.kt` is the desktop entry point; it builds native `TaskRepository -> TaskDataSource` and passes it to shared `App`. |
| [`sharedPresentation`](19_three-layer-kmp-domain-presentation/sharedPresentation/) | KMP owns `MainViewController`, `App -> HomeScreen -> HomeViewModel -> HomeUiState`. |
| [`sharedDomain`](19_three-layer-kmp-domain-presentation/sharedDomain/) | KMP owns `GetTasksUseCase`, `Task`, and the `TaskRepository` contract. |

## How To Re-Validate Quickly

```sh
rg -n "Sample[M]essage|sample[D]etail|TO[D]O|FIX[M]E" samples
rg -n "org\.jetbrains\.kotlin\.android|kotlin-android" samples -g '*.gradle.kts'
python3 -m json.tool diagrams/manifest.json
node --check diagrams/bundle.js
git diff --check
```

For Gradle commands per sample, use each sample README or [../TESTING.md](../TESTING.md).
