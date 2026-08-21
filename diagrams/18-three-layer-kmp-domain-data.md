# 18. Three Layer KMP Domain And Data

Domain and data are shared. Each app target keeps an app-owned presentation layer containing UI and ViewModel.

```mermaid
---
config:
  layout: elk
  elk:
    nodePlacementStrategy: LINEAR_SEGMENTS
---
flowchart TB
  subgraph Android[":androidApp\nAndroid app module"]
    direction TB
    subgraph APresentation["Presentation layer\napp-owned code"]
      direction TB
      AUI["HomeScreen.kt\nCompose UI"]
      AVM["HomeViewModel.kt"]
      AUI --> AVM
    end
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    subgraph IPresentation["Presentation layer\napp-owned code"]
      direction TB
      IUI["ContentView.swift\nSwiftUI"]
      IVM["HomeViewModel.swift"]
      IUI --> IVM
    end
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    subgraph DPresentation["Presentation layer\napp-owned code"]
      direction TB
      DUI["HomeWindow.kt\nCompose Desktop UI"]
      DVM["HomeViewModel.kt"]
      DUI --> DVM
    end
  end

  subgraph Domain[":sharedDomain\nKMP library module"]
    direction TB
    UseCase["GetTasksUseCase.kt"]
    Entity["Task.kt"]
    UseCase -->|"creates Task"| Entity
  end

  subgraph Data[":sharedData\nKMP library module"]
    direction TB
    Repository["TaskRepository.kt"]
    Remote["RemoteTaskDataSource.kt"]
    Cache["LocalTaskDataSource.kt"]
    Mapper["TaskDtoMapper.kt"]
    Repository --> Remote
    Repository --> Cache
    Repository -->|"maps results"| Mapper
  end

  DVM -->|"uses shared domain"| Domain
  IVM -->|"uses shared domain"| Domain
  AVM -->|"uses shared domain"| Domain
  UseCase -->|"calls shared data"| Data

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AUI,AVM,IUI,IVM,DUI,DVM app;
  class UseCase,Entity,Repository,Remote,Cache,Mapper kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style APresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style Domain fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style Data fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
