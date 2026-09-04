# 12. Modular KMP UI Layer

Feature one stays native inside every platform app. Feature two shares Compose UI only; native ViewModels call native repositories and data sources.

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
    AEntry["MainActivity.kt"]
    subgraph AFeatureOne["Feature 1\napp-owned code"]
      direction TB
      AHomeUI["FeatureOneScreen.kt"]
      AHomeVM["HomeViewModel.kt"]
      ATaskRepository["TaskRepository.kt"]
      ATaskDataSource["TaskDataSource.kt"]
      AHomeUI --> AHomeVM --> ATaskRepository --> ATaskDataSource
    end
    subgraph AFeatureTwo["Feature 2 logic\napp-owned code"]
      direction TB
      ADetailsVM["DetailsViewModel.kt"]
      ADetailsRepository["DetailsRepository.kt"]
      ADetailsDataSource["DetailsDataSource.kt"]
      ADetailsVM --> ADetailsRepository --> ADetailsDataSource
    end
    AEntry -->|"renders Feature 1"| AFeatureOne
    AEntry -->|"creates + refreshes"| AFeatureTwo
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    IEntry["ContentView.swift"]
    subgraph IFeatureOne["Feature 1\napp-owned code"]
      direction TB
      IHomeUI["FeatureOneView.swift"]
      IHomeVM["HomeViewModel.swift"]
      ITaskRepository["TaskRepository.swift"]
      ITaskDataSource["TaskDataSource.swift"]
      IHomeUI --> IHomeVM --> ITaskRepository --> ITaskDataSource
    end
    subgraph IFeatureTwo["Feature 2 logic\napp-owned code"]
      direction TB
      IDetailsVM["DetailsViewModel.swift"]
      IDetailsRepository["DetailsRepository.swift"]
      IDetailsDataSource["DetailsDataSource.swift"]
      IDetailsVM --> IDetailsRepository --> IDetailsDataSource
    end
    IEntry -->|"renders Feature 1"| IFeatureOne
    IEntry -->|"creates + refreshes"| IFeatureTwo
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    DEntry["Main.kt"]
    subgraph DFeatureOne["Feature 1\napp-owned code"]
      direction TB
      DHomeUI["FeatureOneScreen.kt"]
      DHomeVM["HomeViewModel.kt"]
      DTaskRepository["TaskRepository.kt"]
      DTaskDataSource["TaskDataSource.kt"]
      DHomeUI --> DHomeVM --> DTaskRepository --> DTaskDataSource
    end
    subgraph DFeatureTwo["Feature 2 logic\napp-owned code"]
      direction TB
      DDetailsVM["DetailsViewModel.kt"]
      DDetailsRepository["DetailsRepository.kt"]
      DDetailsDataSource["DetailsDataSource.kt"]
      DDetailsVM --> DDetailsRepository --> DDetailsDataSource
    end
    DEntry -->|"renders Feature 1"| DFeatureOne
    DEntry -->|"creates + refreshes"| DFeatureTwo
  end

  subgraph KMP[":featureTwoSharedUI\nKMP library module"]
    direction TB
    App["App.kt"]
    Screen["DetailsScreen.kt"]
    State["DetailsUiState.kt"]
    App -->|"renders"| Screen
    Screen -->|"reads"| State
  end

  DEntry -->|"passes state + refresh callback"| KMP
  IEntry -->|"passes state + refresh callback"| KMP
  AEntry -->|"passes state + refresh callback"| KMP

  classDef app fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  classDef kmp fill:#f8f5fe,stroke:#6e4bae,color:#334155,stroke-width:1.4px;
  class AEntry,AHomeUI,AHomeVM,ATaskRepository,ATaskDataSource,ADetailsVM,ADetailsRepository,ADetailsDataSource,IEntry,IHomeUI,IHomeVM,ITaskRepository,ITaskDataSource,IDetailsVM,IDetailsRepository,IDetailsDataSource,DEntry,DHomeUI,DHomeVM,DTaskRepository,DTaskDataSource,DDetailsVM,DDetailsRepository,DDetailsDataSource app;
  class App,Screen,State kmp;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style AFeatureOne fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style AFeatureTwo fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IFeatureOne fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IFeatureTwo fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DFeatureOne fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DFeatureTwo fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style KMP fill:#f8f5fe,stroke:#6e4bae,stroke-width:1.6px
```
