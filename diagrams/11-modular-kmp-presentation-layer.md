# 11. Modular KMP Presentation Layer

Feature one stays native inside every platform app. Feature two shares presentation as a KMP module; feature two data remains native.

```mermaid
flowchart TB
  subgraph Android["androidApp"]
    direction TB
    AEntry["MainActivity.kt\nCompose host"]
    subgraph AFeatureOne["featureOne native code"]
      direction TB
      AHomeUI["FeatureOneScreen.kt\nCompose UI"]
      AHomeVM["HomeViewModel.kt"]
      ATaskRepository["TaskRepository.kt"]
      ATaskDataSource["TaskDataSource.kt"]
      AHomeUI --> AHomeVM --> ATaskRepository --> ATaskDataSource
    end
    subgraph AFeatureTwo["featureTwo native data"]
      direction TB
      ADetailsRepository["DetailsRepository.kt"]
      ADetailsDataSource["DetailsDataSource.kt"]
      ADetailsRepository --> ADetailsDataSource
    end
    AEntry --> AHomeUI
  end

  subgraph IOS["iosApp"]
    direction TB
    IEntry["ContentView.swift\nSwiftUI + Compose host"]
    subgraph IFeatureOne["featureOne native code"]
      direction TB
      IHomeUI["FeatureOneView.swift\nSwiftUI"]
      IHomeVM["HomeViewModel.swift"]
      ITaskRepository["TaskRepository.swift"]
      ITaskDataSource["TaskDataSource.swift"]
      IHomeUI --> IHomeVM --> ITaskRepository --> ITaskDataSource
    end
    subgraph IFeatureTwo["featureTwo native data"]
      direction TB
      IDetailsRepository["IosDetailsRepository.swift"]
      IDetailsDataSource["DetailsDataSource.swift"]
      IDetailsRepository --> IDetailsDataSource
    end
    IEntry --> IHomeUI
  end

  subgraph Desktop["desktopApp"]
    direction TB
    DEntry["Main.kt\nCompose Desktop host"]
    subgraph DFeatureOne["featureOne native code"]
      direction TB
      DHomeUI["FeatureOneScreen.kt\nCompose Desktop UI"]
      DHomeVM["HomeViewModel.kt"]
      DTaskRepository["TaskRepository.kt"]
      DTaskDataSource["TaskDataSource.kt"]
      DHomeUI --> DHomeVM --> DTaskRepository --> DTaskDataSource
    end
    subgraph DFeatureTwo["featureTwo native data"]
      direction TB
      DDetailsRepository["DetailsRepository.kt"]
      DDetailsDataSource["DetailsDataSource.kt"]
      DDetailsRepository --> DDetailsDataSource
    end
    DEntry --> DHomeUI
  end

  subgraph KMP["featureTwoSharedPresentation KMP module"]
    direction LR
    App["App.kt\nCompose UI entry"]
    Screen["DetailsScreen.kt\nCompose Multiplatform UI"]
    State["DetailsUiState.kt"]
    VM["DetailsViewModel.kt"]
    RepositoryPort["DetailsRepository.kt\ncontract"]
    App --> Screen --> VM
    VM --> State
    VM --> RepositoryPort
  end

  AEntry --> App
  IEntry --> App
  DEntry --> App
  RepositoryPort -. "implemented by native" .-> ADetailsRepository
  RepositoryPort -. "implemented by native" .-> IDetailsRepository
  RepositoryPort -. "implemented by native" .-> DDetailsRepository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,AHomeUI,AHomeVM,ATaskRepository,ATaskDataSource,ADetailsRepository,ADetailsDataSource,IEntry,IHomeUI,IHomeVM,ITaskRepository,ITaskDataSource,IDetailsRepository,IDetailsDataSource,DEntry,DHomeUI,DHomeVM,DTaskRepository,DTaskDataSource,DDetailsRepository,DDetailsDataSource app;
  class App,Screen,State,VM,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style AFeatureOne fill:#e8f4ff,stroke:#1f5f8b,stroke-width:2px
  style AFeatureTwo fill:#e8f4ff,stroke:#1f5f8b,stroke-width:2px
  style IFeatureOne fill:#e8f4ff,stroke:#1f5f8b,stroke-width:2px
  style IFeatureTwo fill:#e8f4ff,stroke:#1f5f8b,stroke-width:2px
  style DFeatureOne fill:#e8f4ff,stroke:#1f5f8b,stroke-width:2px
  style DFeatureTwo fill:#e8f4ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
