# 03. KMP Compose UI

All platform entry points are separate app targets. Compose UI is shared, while ViewModel, repository, and data source logic stay native.

```mermaid
---
config:
  layout: elk
  elk:
    nodePlacementStrategy: LINEAR_SEGMENTS
---
flowchart TB
  subgraph Android[":androidApp\nAndroid app module"]
    AEntry["MainActivity.kt\nplatform host"]
    AVM["HomeViewModel.kt"]
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    AEntry -->|"creates + refreshes"| AVM
    AVM --> ARepository --> ADataSource
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    IEntry["ContentView.swift\nplatform host"]
    IVM["HomeViewModel.swift"]
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IEntry -->|"creates + refreshes"| IVM
    IVM --> IRepository --> IDataSource
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    DEntry["Main.kt\nplatform host"]
    DVM["HomeViewModel.kt"]
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DEntry -->|"creates + refreshes"| DVM
    DVM --> DRepository --> DDataSource
  end

  subgraph KMP[":shared\nKMP library module"]
    direction TB
    App["App.kt\nCompose UI"]
    State["HomeUiState\ndefined in App.kt"]
    App -->|"renders"| State
  end

  DEntry -->|"passes state + refresh callback"| KMP
  IEntry -->|"passes state + refresh callback"| KMP
  AEntry -->|"passes state + refresh callback"| KMP

  classDef app fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  classDef kmp fill:#f8f5fe,stroke:#6e4bae,color:#334155,stroke-width:1.4px;
  class AEntry,AVM,ARepository,ADataSource,IEntry,IVM,IRepository,IDataSource,DEntry,DVM,DRepository,DDataSource app;
  class App,State kmp;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style KMP fill:#f8f5fe,stroke:#6e4bae,stroke-width:1.6px
```
