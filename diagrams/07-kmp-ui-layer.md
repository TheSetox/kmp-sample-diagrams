# 07. KMP UI Layer

Only Compose UI is shared with Compose Multiplatform. Native ViewModels call native repositories and data sources.

```mermaid
---
config:
  layout: elk
  elk:
    nodePlacementStrategy: LINEAR_SEGMENTS
---
flowchart TB
  subgraph Android[":androidApp\nAndroid app module"]
    AHost["MainActivity.kt\nCompose host"]
    AVM["HomeViewModel.kt"]
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    AHost -->|"creates + refreshes"| AVM
    AVM --> ARepository --> ADataSource
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    IHost["ContentView.swift\nSwiftUI / UIKit Compose host"]
    IVM["HomeViewModel.swift"]
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IHost -->|"creates + refreshes"| IVM
    IVM --> IRepository --> IDataSource
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    DHost["Main.kt\nCompose Desktop host"]
    DVM["HomeViewModel.kt"]
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DHost -->|"creates + refreshes"| DVM
    DVM --> DRepository --> DDataSource
  end

  subgraph KMP[":sharedUI\nKMP library module"]
    direction TB
    App["App.kt\nCompose UI"]
    State["HomeUiState\ndefined in App.kt"]
    App -->|"renders"| State
  end

  DHost -->|"passes state + refresh callback"| KMP
  IHost -->|"passes state + refresh callback"| KMP
  AHost -->|"passes state + refresh callback"| KMP

  classDef app fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  classDef kmp fill:#f8f5fe,stroke:#6e4bae,color:#334155,stroke-width:1.4px;
  class AHost,AVM,ARepository,ADataSource,IHost,IVM,IRepository,IDataSource,DHost,DVM,DRepository,DDataSource app;
  class App,State kmp;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style KMP fill:#f8f5fe,stroke:#6e4bae,stroke-width:1.6px
```
