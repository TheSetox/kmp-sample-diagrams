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
    AVM -->|"uses domain layer"| ADomain
    AUseCase -->|"uses data layer"| AData
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
    IVM -->|"uses domain layer"| IDomain
    IUseCase -->|"uses data layer"| IData
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
    DVM -->|"uses domain layer"| DDomain
    DUseCase -->|"uses data layer"| DData
  end

  classDef native fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  class AUI,AVM,AUseCase,AEntity,ARepository,ADataSource,IUI,IVM,IUseCase,IEntity,IRepository,IDataSource,DUI,DVM,DUseCase,DEntity,DRepository,DDataSource native;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style APresentation fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style ADomain fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style AData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IPresentation fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IDomain fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DPresentation fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DDomain fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
```
