# 14. Modular KMP Shared Feature

Feature one stays native in every platform module. Feature two is consolidated into one shared KMP feature module.

```mermaid
flowchart TB
  subgraph Android["androidApp"]
    direction TB
    AEntry["MainActivity.kt"]
    AHomeVM["HomeViewModel.kt"]
    ATaskRepository["TaskRepository.kt"]
    ATaskDataSource["TaskDataSource.kt"]
    AEntry --> AHomeVM --> ATaskRepository --> ATaskDataSource
  end

  subgraph IOS["iosApp"]
    direction TB
    IEntry["ContentView.swift"]
    IHomeVM["HomeViewModel.swift"]
    ITaskRepository["TaskRepository.swift"]
    ITaskDataSource["TaskDataSource.swift"]
    IEntry --> IHomeVM --> ITaskRepository --> ITaskDataSource
  end

  subgraph Desktop["desktopApp"]
    direction TB
    DEntry["Main.kt"]
    DHomeVM["HomeViewModel.kt"]
    DTaskRepository["TaskRepository.kt"]
    DTaskDataSource["TaskDataSource.kt"]
    DEntry --> DHomeVM --> DTaskRepository --> DTaskDataSource
  end

  subgraph KMP["featureTwoSharedFeature KMP module"]
    direction LR
    App["App.kt"]
    Screen["DetailsScreen.kt"]
    State["DetailsUiState.kt"]
    VM["DetailsViewModel.kt"]
    Repository["DetailsRepository.kt"]
    DataSource["DetailsDataSource.kt"]
    App --> Screen --> VM --> Repository --> DataSource
    VM --> State
  end

  AEntry --> App
  IEntry --> App
  DEntry --> App

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,AHomeVM,ATaskRepository,ATaskDataSource,IEntry,IHomeVM,ITaskRepository,ITaskDataSource,DEntry,DHomeVM,DTaskRepository,DTaskDataSource app;
  class App,Screen,State,VM,Repository,DataSource kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
