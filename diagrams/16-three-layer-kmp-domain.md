# 16. Three Layer KMP Domain

The domain layer is shared. Presentation and data remain app-owned layers; presentation contains UI plus ViewModel.

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
    subgraph AData["Data layer\napp-owned code"]
      direction TB
      ARepository["TaskRepository.kt\nimplements shared TaskRepository"]
      ADataSource["TaskDataSource.kt"]
      ARepository --> ADataSource
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
    subgraph IData["Data layer\napp-owned code"]
      direction TB
      IRepository["IosTaskRepository\nTaskRepository.swift · implements shared contract"]
      IDataSource["TaskDataSource.swift"]
      IRepository --> IDataSource
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
    subgraph DData["Data layer\napp-owned code"]
      direction TB
      DRepository["TaskRepository.kt\nimplements shared TaskRepository"]
      DDataSource["TaskDataSource.kt"]
      DRepository --> DDataSource
    end
  end

  subgraph KMP[":sharedDomain\nKMP library module"]
    direction TB
    UseCase["GetTasksUseCase.kt"]
    Entity["Task.kt"]
    RepositoryPort["TaskRepository contract"]
    UseCase -->|"returns Task"| Entity
    UseCase -->|"calls"| RepositoryPort
  end

  DVM -->|"uses shared domain"| KMP
  IVM -->|"uses shared domain"| KMP
  AVM -->|"uses shared domain"| KMP

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AUI,AVM,ARepository,ADataSource,IUI,IVM,IRepository,IDataSource,DUI,DVM,DRepository,DDataSource app;
  class UseCase,Entity,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style APresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style AData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
