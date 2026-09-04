# 19. Three Layer KMP Domain And Presentation

Domain and presentation are shared. Presentation contains shared Compose UI and ViewModel; data implementations remain native.

```mermaid
---
config:
  layout: elk
  elk:
    nodePlacementStrategy: LINEAR_SEGMENTS
---
flowchart LR
  subgraph Android[":androidApp\nAndroid app module"]
    direction TB
    AEntry["MainActivity.kt\nplatform host"]
    subgraph AData["Native data implementation\napp-owned code"]
      direction TB
      ARepository["TaskRepository.kt\nimplements shared TaskRepository"]
      ADataSource["TaskDataSource.kt"]
      ARepository --> ADataSource
    end
    AEntry -->|"creates native data"| AData
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    IEntry["ContentView.swift\nplatform host"]
    subgraph IData["Native data implementation\napp-owned code"]
      direction TB
      IRepository["IosTaskRepository\nTaskRepository.swift · implements shared contract"]
      IDataSource["TaskDataSource.swift"]
      IRepository --> IDataSource
    end
    IEntry -->|"creates native data"| IData
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    DEntry["Main.kt\nplatform host"]
    subgraph DData["Native data implementation\napp-owned code"]
      direction TB
      DRepository["TaskRepository.kt\nimplements shared TaskRepository"]
      DDataSource["TaskDataSource.kt"]
      DRepository --> DDataSource
    end
    DEntry -->|"creates native data"| DData
  end

  subgraph Presentation[":sharedPresentation\nKMP library module"]
    direction TB
    Controller["MainViewController.kt\niOS factory"]
    App["App.kt\nCompose app"]
    Screen["HomeScreen.kt"]
    VM["HomeViewModel.kt"]
    State["HomeUiState.kt"]
    Controller -->|"creates"| App
    App -->|"creates + calls"| VM
    App -->|"passes state + refresh callback"| Screen
    VM -->|"returns"| State
    Screen -->|"reads"| State
  end

  subgraph Domain[":sharedDomain\nKMP library module"]
    direction TB
    UseCase["GetTasksUseCase.kt"]
    Entity["Task.kt"]
    RepositoryPort["TaskRepository.kt\nshared contract"]
    UseCase -->|"returns Task"| Entity
    UseCase -->|"calls"| RepositoryPort
  end

  Desktop -->|"hosts + injects repository"| Presentation
  IOS -->|"hosts via iOS factory + injects repository"| Presentation
  Android -->|"hosts + injects repository"| Presentation
  Presentation -->|"uses shared domain"| Domain

  classDef app fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  classDef kmp fill:#f8f5fe,stroke:#6e4bae,color:#334155,stroke-width:1.4px;
  class AEntry,ARepository,ADataSource,IEntry,IRepository,IDataSource,DEntry,DRepository,DDataSource app;
  class Controller,App,Screen,VM,State,UseCase,Entity,RepositoryPort kmp;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style AData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style Presentation fill:#f8f5fe,stroke:#6e4bae,stroke-width:1.6px
  style Domain fill:#f8f5fe,stroke:#6e4bae,stroke-width:1.6px
```
