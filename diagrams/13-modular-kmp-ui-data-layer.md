# 13. Modular KMP UI And Data Layers

Feature one stays native in every platform module. Feature two shares UI and data as separate KMP modules; native ViewModels connect the shared UI to shared data.

```mermaid
flowchart TB
  subgraph Android["androidApp"]
    direction TB
    AEntry["MainActivity.kt"]
    AHomeVM["HomeViewModel.kt"]
    ATaskRepository["TaskRepository.kt"]
    ATaskDataSource["TaskDataSource.kt"]
    ADetailsVM["DetailsViewModel.kt"]
    AEntry --> AHomeVM --> ATaskRepository --> ATaskDataSource
    AEntry --> ADetailsVM
  end

  subgraph IOS["iosApp"]
    direction TB
    IEntry["ContentView.swift"]
    IHomeVM["HomeViewModel.swift"]
    ITaskRepository["TaskRepository.swift"]
    ITaskDataSource["TaskDataSource.swift"]
    IDetailsVM["DetailsViewModel.swift"]
    IEntry --> IHomeVM --> ITaskRepository --> ITaskDataSource
    IEntry --> IDetailsVM
  end

  subgraph Desktop["desktopApp"]
    direction TB
    DEntry["Main.kt"]
    DHomeVM["HomeViewModel.kt"]
    DTaskRepository["TaskRepository.kt"]
    DTaskDataSource["TaskDataSource.kt"]
    DDetailsVM["DetailsViewModel.kt"]
    DEntry --> DHomeVM --> DTaskRepository --> DTaskDataSource
    DEntry --> DDetailsVM
  end

  subgraph UIKMP["featureTwoSharedUI KMP module"]
    direction LR
    App["App.kt"]
    Screen["DetailsScreen.kt"]
    State["DetailsUiState.kt"]
    App --> Screen --> State
  end

  subgraph DataKMP["featureTwoSharedData KMP module"]
    direction LR
    Repository["DetailsRepository.kt"]
    Remote["RemoteDetailsDataSource.kt"]
    Cache["LocalDetailsDataSource.kt"]
    Mapper["DetailsDtoMapper.kt"]
    Repository --> Remote
    Repository --> Cache
    Remote --> Mapper
    Cache --> Mapper
  end

  AEntry --> App
  IEntry --> App
  DEntry --> App
  ADetailsVM --> Repository
  IDetailsVM --> Repository
  DDetailsVM --> Repository
  Screen -. "state and events" .-> ADetailsVM
  Screen -. "state and events" .-> IDetailsVM
  Screen -. "state and events" .-> DDetailsVM

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,AHomeVM,ATaskRepository,ATaskDataSource,ADetailsVM,IEntry,IHomeVM,ITaskRepository,ITaskDataSource,IDetailsVM,DEntry,DHomeVM,DTaskRepository,DTaskDataSource,DDetailsVM app;
  class App,Screen,State,Repository,Remote,Cache,Mapper kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style UIKMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style DataKMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
