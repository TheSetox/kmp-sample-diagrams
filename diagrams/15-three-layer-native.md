# 15. Three Layer Native

Baseline three-layer native architecture. Each app target owns presentation, domain, and data layers. These layers are app-owned code groupings, not separate build modules.

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
      AUI["MainActivity.kt\nAndroid TextView UI"]
      AVM["HomeViewModel.kt"]
      AUI --> AVM
    end
    subgraph ADomain["Domain layer\napp-owned code"]
      AUseCase["GetTasksUseCase.kt"]
      AEntity["Task.kt"]
      AUseCase -->|"creates Task"| AEntity
    end
    subgraph AData["Data layer\napp-owned code"]
      ARepository["TaskRepository.kt"]
      ADataSource["TaskDataSource.kt"]
      ARepository --> ADataSource
    end
    AVM --> AUseCase
    AUseCase -->|"calls"| ARepository
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    subgraph IPresentation["Presentation layer\napp-owned code"]
      IUI["ContentView.swift\nSwiftUI"]
      IVM["HomeViewModel.swift"]
      IUI --> IVM
    end
    subgraph IDomain["Domain layer\napp-owned code"]
      IUseCase["GetTasksUseCase.swift"]
      IEntity["Task.swift"]
      IUseCase -->|"creates Task"| IEntity
    end
    subgraph IData["Data layer\napp-owned code"]
      IRepository["TaskRepository.swift"]
      IDataSource["TaskDataSource.swift"]
      IRepository --> IDataSource
    end
    IVM --> IUseCase
    IUseCase -->|"calls"| IRepository
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    subgraph DPresentation["Presentation layer\napp-owned code"]
      DUI["Main.kt\nCompose Desktop UI"]
      DVM["HomeViewModel.kt"]
      DUI --> DVM
    end
    subgraph DDomain["Domain layer\napp-owned code"]
      DUseCase["GetTasksUseCase.kt"]
      DEntity["Task.kt"]
      DUseCase -->|"creates Task"| DEntity
    end
    subgraph DData["Data layer\napp-owned code"]
      DRepository["TaskRepository.kt"]
      DDataSource["TaskDataSource.kt"]
      DRepository --> DDataSource
    end
    DVM --> DUseCase
    DUseCase -->|"calls"| DRepository
  end

  classDef native fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AUI,AVM,AUseCase,AEntity,ARepository,ADataSource,IUI,IVM,IUseCase,IEntity,IRepository,IDataSource,DUI,DVM,DUseCase,DEntity,DRepository,DDataSource native;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style APresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style ADomain fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style AData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IDomain fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DDomain fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
```
