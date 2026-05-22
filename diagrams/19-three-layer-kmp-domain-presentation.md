# 19. Three Layer KMP Domain And Presentation

Domain and presentation are shared. Presentation contains shared Compose UI and ViewModel; data implementations remain native.

```mermaid
flowchart TB
  subgraph Android["androidApp"]
    direction TB
    AEntry["MainActivity.kt"]
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    AEntry --> ARepository
    ARepository --> ADataSource
  end

  subgraph IOS["iosApp"]
    direction TB
    IEntry["ContentView.swift"]
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IEntry --> IRepository
    IRepository --> IDataSource
  end

  subgraph Desktop["desktopApp"]
    direction TB
    DEntry["Main.kt"]
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DEntry --> DRepository
    DRepository --> DDataSource
  end

  subgraph Presentation["sharedPresentation KMP module"]
    direction LR
    Controller["MainViewController.kt\niOS factory"]
    App["App.kt\nCompose app"]
    Screen["HomeScreen.kt"]
    VM["HomeViewModel.kt"]
    State["HomeUiState.kt"]
    Controller --> App
    App --> Screen --> VM --> State
  end

  subgraph Domain["sharedDomain KMP module"]
    direction LR
    UseCase["GetTasksUseCase.kt"]
    Entity["Task.kt"]
    RepositoryPort["TaskRepository contract"]
    UseCase --> Entity
    UseCase --> RepositoryPort
  end

  AEntry --> App
  IEntry --> Controller
  DEntry --> App
  VM --> UseCase
  RepositoryPort -. "implemented by native" .-> ARepository
  RepositoryPort -. "implemented by native" .-> IRepository
  RepositoryPort -. "implemented by native" .-> DRepository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,ARepository,ADataSource,IEntry,IRepository,IDataSource,DEntry,DRepository,DDataSource app;
  class Controller,App,Screen,VM,State,UseCase,Entity,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Presentation fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style Domain fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
