# 19. Three Layer KMP Domain And Presentation

Domain and presentation are shared. Presentation contains shared Compose UI and ViewModel; data implementations remain native.

```mermaid
flowchart TB
  subgraph Desktop["desktopApp"]
    direction TB
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DRepository --> DDataSource
  end

  subgraph IOS["iosApp"]
    direction TB
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IRepository --> IDataSource
  end

  subgraph Android["androidApp"]
    direction TB
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    ARepository --> ADataSource
  end

  subgraph Presentation["sharedPresentation KMP module"]
    direction LR
    App["Compose App"]
    Screen["HomeScreen.kt"]
    VM["HomeViewModel.kt"]
    State["HomeUiState.kt"]
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

  VM --> UseCase
  RepositoryPort -. "implemented by native" .-> ARepository
  RepositoryPort -. "implemented by native" .-> IRepository
  RepositoryPort -. "implemented by native" .-> DRepository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class ARepository,ADataSource,IRepository,IDataSource,DRepository,DDataSource app;
  class App,Screen,VM,State,UseCase,Entity,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Presentation fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style Domain fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
