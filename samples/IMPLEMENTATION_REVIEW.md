# Sample Implementation Review

This review maps every diagram scenario to the current sample code on `feature/kmp-2026-mermaid-samples`. It is intended as a reading guide for code review: start with the module row, then open the linked module folder.

## Validation Summary

- Review date: May 22, 2026.
- Branch: `feature/kmp-2026-mermaid-samples`.
- All 19 samples have `androidApp`, `desktopApp`, and `iosApp/Sources/ContentView.swift`.
- Static scan found no stale placeholder message classes, sample-detail helpers, or todo/fixme markers.
- Android app Gradle files do not apply `org.jetbrains.kotlin.android`; they rely on AGP built-in Kotlin.
- Build verification details are recorded in [../TESTING.md](../TESTING.md).

## Review Findings

No blocking architecture mismatches were found in this pass. The known local tooling caveat is still the Compose-heavy iOS framework link: shared Compose UI/presentation modules compile for desktop and Android app assembly passes, but full iOS Compose framework linking can exceed the local Gradle daemon heap/metaspace settings. Plain shared logic/data/domain modules assembled fully, including Kotlin/Native framework tasks.

## Baseline

### normal-native

- Sample: [`normal-native`](normal-native/)
- Diagram: [`01-normal-native.md`](../diagrams/01-normal-native.md)
- Verdict: Matches: each platform has its own direct UI -> ViewModel -> Repository -> DataSource flow.

| Module | How It Works |
| --- | --- |
| [`androidApp`](normal-native/androidApp/) | Android entry point renders a native text screen and calls `HomeViewModel -> TaskRepository -> TaskDataSource` in Android code. |
| [`iosApp`](normal-native/iosApp/) | SwiftUI `ContentView` calls native Swift `HomeViewModel -> TaskRepository -> TaskDataSource`. |
| [`desktopApp`](normal-native/desktopApp/) | Compose Desktop window calls desktop `HomeViewModel -> TaskRepository -> TaskDataSource`. |

### layered-native

- Sample: [`layered-native`](layered-native/)
- Diagram: [`04-layered-native.md`](../diagrams/04-layered-native.md)
- Verdict: Matches: presentation and data are separated per platform, with no use case layer.

| Module | How It Works |
| --- | --- |
| [`androidApp`](layered-native/androidApp/) | `presentation/HomeViewModel` calls `data/TaskRepository -> TaskDataSource`; `MainActivity` owns the Android entry point. |
| [`iosApp`](layered-native/iosApp/) | SwiftUI `ContentView` calls Swift `HomeViewModel -> TaskRepository -> TaskDataSource`. |
| [`desktopApp`](layered-native/desktopApp/) | `presentation/HomeViewModel` calls `data/TaskRepository -> TaskDataSource`; `Main.kt` owns the desktop entry point. |

### modular-native

- Sample: [`modular-native`](modular-native/)
- Diagram: [`09-modular-native.md`](../diagrams/09-modular-native.md)
- Verdict: Matches: feature one and feature two are duplicated per platform as native modules/packages.

| Module | How It Works |
| --- | --- |
| [`androidApp`](modular-native/androidApp/) | `featureone/HomeViewModel -> TaskRepository -> TaskDataSource` and `featuretwo/DetailsViewModel -> DetailsRepository -> DetailsDataSource`. |
| [`iosApp`](modular-native/iosApp/) | SwiftUI hosts Swift feature-one task classes and feature-two details classes. |
| [`desktopApp`](modular-native/desktopApp/) | Desktop packages mirror Android: `featureone` for task summary and `featuretwo` for details. |

### three-layer-native

- Sample: [`three-layer-native`](three-layer-native/)
- Diagram: [`15-three-layer-native.md`](../diagrams/15-three-layer-native.md)
- Verdict: Matches: every platform owns presentation, domain, and data classes.

| Module | How It Works |
| --- | --- |
| [`androidApp`](three-layer-native/androidApp/) | `presentation/HomeViewModel -> domain/GetTasksUseCase -> data/TaskRepository -> TaskDataSource`, with `Task` in domain. |
| [`iosApp`](three-layer-native/iosApp/) | SwiftUI calls Swift `HomeViewModel -> GetTasksUseCase -> TaskRepository -> TaskDataSource`, with Swift `Task` entity. |
| [`desktopApp`](three-layer-native/desktopApp/) | Desktop mirrors Android with presentation, domain, and data packages. |

## Main KMP

### kmp-native-ui

- Sample: [`kmp-native-ui`](kmp-native-ui/)
- Diagram: [`02-kmp-native-ui.md`](../diagrams/02-kmp-native-ui.md)
- Verdict: Matches: platform UI is native while the ViewModel, use case, repository, and data source are shared.

| Module | How It Works |
| --- | --- |
| [`androidApp`](kmp-native-ui/androidApp/) | `MainActivity` creates the shared `HomeViewModel` and displays its state in Android UI. |
| [`iosApp`](kmp-native-ui/iosApp/) | SwiftUI `ContentView` calls the exported shared `HomeViewModel`. |
| [`desktopApp`](kmp-native-ui/desktopApp/) | Compose Desktop calls the shared `HomeViewModel`. |
| [`sharedLogic`](kmp-native-ui/sharedLogic/) | KMP flow is `HomeViewModel -> GetTasksUseCase -> TaskRepository -> TaskDataSource`. |

### kmp-compose-ui

- Sample: [`kmp-compose-ui`](kmp-compose-ui/)
- Diagram: [`03-kmp-compose-ui.md`](../diagrams/03-kmp-compose-ui.md)
- Verdict: Matches the corrected intent: UI is shared, behavior is native.

| Module | How It Works |
| --- | --- |
| [`androidApp`](kmp-compose-ui/androidApp/) | Android owns `HomeViewModel -> TaskRepository -> TaskDataSource`, then passes `HomeUiState` and refresh callback to shared UI. |
| [`iosApp`](kmp-compose-ui/iosApp/) | Swift owns `HomeViewModel -> TaskRepository -> TaskDataSource`, then hosts the KMP Compose UI via `MainViewController`. |
| [`desktopApp`](kmp-compose-ui/desktopApp/) | Desktop owns `HomeViewModel -> TaskRepository -> TaskDataSource`, then renders shared `App(state, onRefresh)`. |
| [`shared`](kmp-compose-ui/shared/) | KMP UI-only surface exposes `HomeUiState`, `App(state, onRefresh)`, and iOS `MainViewController(...)`. |

### kmp-data-layer

- Sample: [`kmp-data-layer`](kmp-data-layer/)
- Diagram: [`05-kmp-data-layer.md`](../diagrams/05-kmp-data-layer.md)
- Verdict: Matches: UI and ViewModel are native, data is shared.

| Module | How It Works |
| --- | --- |
| [`androidApp`](kmp-data-layer/androidApp/) | Android `HomeViewModel` calls shared `TaskRepository`. |
| [`iosApp`](kmp-data-layer/iosApp/) | Swift `HomeViewModel` imports the shared data framework and calls shared `TaskRepository`. |
| [`desktopApp`](kmp-data-layer/desktopApp/) | Desktop `HomeViewModel` calls shared `TaskRepository`. |
| [`sharedData`](kmp-data-layer/sharedData/) | KMP data flow is `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`. |

### kmp-presentation-layer

- Sample: [`kmp-presentation-layer`](kmp-presentation-layer/)
- Diagram: [`06-kmp-presentation-layer.md`](../diagrams/06-kmp-presentation-layer.md)
- Verdict: Matches: shared presentation depends on a repository contract implemented natively.

| Module | How It Works |
| --- | --- |
| [`androidApp`](kmp-presentation-layer/androidApp/) | Android implements the shared `TaskRepository` contract with native `TaskDataSource`, then hosts shared `App`. |
| [`iosApp`](kmp-presentation-layer/iosApp/) | Swift implements the exported repository contract and hosts shared Compose UI through `MainViewController`. |
| [`desktopApp`](kmp-presentation-layer/desktopApp/) | Desktop implements the repository contract and hosts shared `App`. |
| [`sharedPresentation`](kmp-presentation-layer/sharedPresentation/) | KMP owns `App`, `HomeUiState`, `HomeViewModel`, and the `TaskRepository` contract. |

### kmp-ui-layer

- Sample: [`kmp-ui-layer`](kmp-ui-layer/)
- Diagram: [`07-kmp-ui-layer.md`](../diagrams/07-kmp-ui-layer.md)
- Verdict: Matches: only the Compose UI surface is shared.

| Module | How It Works |
| --- | --- |
| [`androidApp`](kmp-ui-layer/androidApp/) | Android owns `HomeViewModel -> TaskRepository -> TaskDataSource` and passes state/callbacks to `sharedUI`. |
| [`iosApp`](kmp-ui-layer/iosApp/) | Swift owns the ViewModel/repository/data source and passes state/callbacks into the shared UI factory. |
| [`desktopApp`](kmp-ui-layer/desktopApp/) | Desktop owns native-style logic and renders shared UI. |
| [`sharedUI`](kmp-ui-layer/sharedUI/) | KMP UI-only surface exposes `HomeUiState`, `App(state, onRefresh)`, and iOS `MainViewController(...)`. |

### kmp-presentation-data-layer

- Sample: [`kmp-presentation-data-layer`](kmp-presentation-data-layer/)
- Diagram: [`08-kmp-presentation-data-layer.md`](../diagrams/08-kmp-presentation-data-layer.md)
- Verdict: Matches: presentation and data are shared; app targets host only the entry point.

| Module | How It Works |
| --- | --- |
| [`androidApp`](kmp-presentation-data-layer/androidApp/) | `MainActivity` hosts shared `App(platform, repository)`. |
| [`iosApp`](kmp-presentation-data-layer/iosApp/) | SwiftUI hosts the shared Compose view controller. |
| [`desktopApp`](kmp-presentation-data-layer/desktopApp/) | Desktop hosts shared `App(platform, TaskRepository())`. |
| [`sharedPresentation`](kmp-presentation-data-layer/sharedPresentation/) | KMP presentation flow is `App -> HomeViewModel -> HomeUiState`, calling shared data. |
| [`sharedData`](kmp-presentation-data-layer/sharedData/) | KMP data flow is `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`. |

## Modular KMP

### modular-kmp-data-layer

- Sample: [`modular-kmp-data-layer`](modular-kmp-data-layer/)
- Diagram: [`10-modular-kmp-data-layer.md`](../diagrams/10-modular-kmp-data-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two uses shared KMP data.

| Module | How It Works |
| --- | --- |
| [`androidApp`](modular-kmp-data-layer/androidApp/) | Renders native Feature One via `HomeViewModel -> TaskRepository -> TaskDataSource`, then native `DetailsViewModel` calls shared data. |
| [`iosApp`](modular-kmp-data-layer/iosApp/) | SwiftUI renders native Feature One and native `DetailsViewModel` calls the shared data framework. |
| [`desktopApp`](modular-kmp-data-layer/desktopApp/) | Compose Desktop renders native Feature One and native `DetailsViewModel` calls shared data. |
| [`featureTwoSharedData`](modular-kmp-data-layer/featureTwoSharedData/) | KMP owns `DetailsRepository -> RemoteDetailsDataSource / LocalDetailsDataSource -> DetailsDtoMapper`. |

### modular-kmp-presentation-layer

- Sample: [`modular-kmp-presentation-layer`](modular-kmp-presentation-layer/)
- Diagram: [`11-modular-kmp-presentation-layer.md`](../diagrams/11-modular-kmp-presentation-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two presentation is shared and data is native.

| Module | How It Works |
| --- | --- |
| [`androidApp`](modular-kmp-presentation-layer/androidApp/) | Renders native Feature One, implements native `DetailsRepository -> DetailsDataSource`, and hosts shared Feature Two presentation. |
| [`iosApp`](modular-kmp-presentation-layer/iosApp/) | SwiftUI renders native Feature One, implements the repository contract, and hosts shared Compose presentation. |
| [`desktopApp`](modular-kmp-presentation-layer/desktopApp/) | Renders native Feature One, implements native Feature Two data, and hosts shared presentation. |
| [`featureTwoSharedPresentation`](modular-kmp-presentation-layer/featureTwoSharedPresentation/) | KMP owns `App -> DetailsScreen -> DetailsViewModel -> DetailsUiState` plus the `DetailsRepository` contract. |

### modular-kmp-ui-layer

- Sample: [`modular-kmp-ui-layer`](modular-kmp-ui-layer/)
- Diagram: [`12-modular-kmp-ui-layer.md`](../diagrams/12-modular-kmp-ui-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two UI is shared while behavior stays native.

| Module | How It Works |
| --- | --- |
| [`androidApp`](modular-kmp-ui-layer/androidApp/) | Renders native Feature One and native Feature Two `DetailsViewModel -> DetailsRepository -> DetailsDataSource`, passing state/events to shared UI. |
| [`iosApp`](modular-kmp-ui-layer/iosApp/) | SwiftUI renders native Feature One and uses native Feature Two logic with the shared UI factory. |
| [`desktopApp`](modular-kmp-ui-layer/desktopApp/) | Renders native Feature One and native Feature Two logic, then renders shared UI. |
| [`featureTwoSharedUI`](modular-kmp-ui-layer/featureTwoSharedUI/) | KMP owns `App -> DetailsScreen -> DetailsUiState` and receives native state/events. |

### modular-kmp-ui-data-layer

- Sample: [`modular-kmp-ui-data-layer`](modular-kmp-ui-data-layer/)
- Diagram: [`13-modular-kmp-ui-data-layer.md`](../diagrams/13-modular-kmp-ui-data-layer.md)
- Verdict: Matches: Feature One is native and visible; Feature Two UI and data are shared with a native ViewModel bridge.

| Module | How It Works |
| --- | --- |
| [`androidApp`](modular-kmp-ui-data-layer/androidApp/) | Renders native Feature One; native `DetailsViewModel` calls shared data and passes state/events to shared UI. |
| [`iosApp`](modular-kmp-ui-data-layer/iosApp/) | SwiftUI renders native Feature One; native `DetailsViewModel` bridges shared UI and shared data. |
| [`desktopApp`](modular-kmp-ui-data-layer/desktopApp/) | Renders native Feature One; native `DetailsViewModel` connects shared UI and data. |
| [`featureTwoSharedUI`](modular-kmp-ui-data-layer/featureTwoSharedUI/) | KMP owns `App -> DetailsScreen -> DetailsUiState`. |
| [`featureTwoSharedData`](modular-kmp-ui-data-layer/featureTwoSharedData/) | KMP owns `DetailsRepository -> RemoteDetailsDataSource / LocalDetailsDataSource -> DetailsDtoMapper`. |

### modular-kmp-shared-feature

- Sample: [`modular-kmp-shared-feature`](modular-kmp-shared-feature/)
- Diagram: [`14-modular-kmp-shared-feature.md`](../diagrams/14-modular-kmp-shared-feature.md)
- Verdict: Matches: Feature One is native and visible; Feature Two is fully owned by the shared KMP feature module.

| Module | How It Works |
| --- | --- |
| [`androidApp`](modular-kmp-shared-feature/androidApp/) | Renders native Feature One via `HomeViewModel -> TaskRepository -> TaskDataSource`, then hosts shared Feature Two. |
| [`iosApp`](modular-kmp-shared-feature/iosApp/) | SwiftUI renders native Feature One, then hosts the shared Feature Two view controller. |
| [`desktopApp`](modular-kmp-shared-feature/desktopApp/) | Renders native Feature One, then hosts shared Feature Two. |
| [`featureTwoSharedFeature`](modular-kmp-shared-feature/featureTwoSharedFeature/) | KMP owns `App -> DetailsScreen -> DetailsViewModel -> DetailsRepository -> DetailsDataSource`. |

## Three Layer KMP

### three-layer-kmp-domain

- Sample: [`three-layer-kmp-domain`](three-layer-kmp-domain/)
- Diagram: [`16-three-layer-kmp-domain.md`](../diagrams/16-three-layer-kmp-domain.md)
- Verdict: Matches: domain is shared and native repositories implement the shared contract.

| Module | How It Works |
| --- | --- |
| [`androidApp`](three-layer-kmp-domain/androidApp/) | Android owns `HomeScreen -> HomeViewModel`, plus native `TaskRepository -> TaskDataSource`. |
| [`iosApp`](three-layer-kmp-domain/iosApp/) | SwiftUI owns `HomeViewModel`, plus native repository/data source classes implementing the shared contract. |
| [`desktopApp`](three-layer-kmp-domain/desktopApp/) | Desktop owns `HomeWindow -> HomeViewModel`, plus native `TaskRepository -> TaskDataSource`. |
| [`sharedDomain`](three-layer-kmp-domain/sharedDomain/) | KMP owns `GetTasksUseCase`, `Task`, and the `TaskRepository` contract. |

### three-layer-kmp-domain-simple

- Sample: [`three-layer-kmp-domain-simple`](three-layer-kmp-domain-simple/)
- Diagram: [`17-three-layer-kmp-domain-simple.md`](../diagrams/17-three-layer-kmp-domain-simple.md)
- Verdict: Matches the simplified diagram while keeping native repository/data classes so the shared use case is runnable.

| Module | How It Works |
| --- | --- |
| [`androidApp`](three-layer-kmp-domain-simple/androidApp/) | Android owns `HomeScreen -> HomeViewModel` and injects a native repository into the shared use case. |
| [`iosApp`](three-layer-kmp-domain-simple/iosApp/) | SwiftUI owns `HomeViewModel` and injects a native repository into the shared use case. |
| [`desktopApp`](three-layer-kmp-domain-simple/desktopApp/) | Desktop owns `HomeWindow -> HomeViewModel` and injects a native repository into the shared use case. |
| [`sharedDomain`](three-layer-kmp-domain-simple/sharedDomain/) | KMP owns `GetTasksUseCase`, `Task`, and the `TaskRepository` contract. |

### three-layer-kmp-domain-data

- Sample: [`three-layer-kmp-domain-data`](three-layer-kmp-domain-data/)
- Diagram: [`18-three-layer-kmp-domain-data.md`](../diagrams/18-three-layer-kmp-domain-data.md)
- Verdict: Matches: native presentation calls shared domain, and shared domain calls shared data.

| Module | How It Works |
| --- | --- |
| [`androidApp`](three-layer-kmp-domain-data/androidApp/) | Android owns `HomeScreen -> HomeViewModel`; ViewModel calls shared `GetTasksUseCase`. |
| [`iosApp`](three-layer-kmp-domain-data/iosApp/) | SwiftUI owns `HomeViewModel`; ViewModel calls shared `GetTasksUseCase`. |
| [`desktopApp`](three-layer-kmp-domain-data/desktopApp/) | Desktop owns `HomeWindow -> HomeViewModel`; ViewModel calls shared `GetTasksUseCase`. |
| [`sharedDomain`](three-layer-kmp-domain-data/sharedDomain/) | KMP owns `GetTasksUseCase` and `Task`, and depends on shared data. |
| [`sharedData`](three-layer-kmp-domain-data/sharedData/) | KMP owns `TaskRepository -> RemoteTaskDataSource / LocalTaskDataSource -> TaskDtoMapper`. |

### three-layer-kmp-domain-presentation

- Sample: [`three-layer-kmp-domain-presentation`](three-layer-kmp-domain-presentation/)
- Diagram: [`19-three-layer-kmp-domain-presentation.md`](../diagrams/19-three-layer-kmp-domain-presentation.md)
- Verdict: Matches: shared presentation and shared domain call native data implementations through a contract.

| Module | How It Works |
| --- | --- |
| [`androidApp`](three-layer-kmp-domain-presentation/androidApp/) | Android implements `TaskRepository -> TaskDataSource` and passes it to shared presentation. |
| [`iosApp`](three-layer-kmp-domain-presentation/iosApp/) | Swift implements `TaskRepository -> TaskDataSource` and passes it to the shared Compose view controller. |
| [`desktopApp`](three-layer-kmp-domain-presentation/desktopApp/) | Desktop implements `TaskRepository -> TaskDataSource` and passes it to shared `App`. |
| [`sharedPresentation`](three-layer-kmp-domain-presentation/sharedPresentation/) | KMP owns `App -> HomeScreen -> HomeViewModel -> HomeUiState`. |
| [`sharedDomain`](three-layer-kmp-domain-presentation/sharedDomain/) | KMP owns `GetTasksUseCase`, `Task`, and the `TaskRepository` contract. |

## How To Re-Validate Quickly

```sh
rg -n "Sample[M]essage|sample[D]etail|TO[D]O|FIX[M]E" samples
rg -n "org\.jetbrains\.kotlin\.android|kotlin-android" samples -g '*.gradle.kts'
python3 -m json.tool diagrams/manifest.json
node --check diagrams/bundle.js
git diff --check
```

For Gradle commands per sample, use each sample README or [../TESTING.md](../TESTING.md).
