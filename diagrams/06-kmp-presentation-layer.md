# 06. KMP Presentation Layer

Presentation is shared in a KMP module. In this two-layer scenario, presentation contains shared Compose UI and ViewModel; data remains native.

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
    AEntry["MainActivity.kt\nCompose host"]
    ARepository["TaskRepository.kt\nimplements shared TaskRepository"]
    ADataSource["TaskDataSource.kt"]
    AEntry -->|"creates"| ARepository
    ARepository --> ADataSource
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    IEntry["ContentView.swift\nSwiftUI / UIKit Compose host"]
    IRepository["IosTaskRepository.swift\nimplements shared TaskRepository"]
    IDataSource["TaskDataSource.swift"]
    IEntry -->|"creates"| IRepository
    IRepository --> IDataSource
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    DEntry["Main.kt\nCompose Desktop host"]
    DRepository["TaskRepository.kt\nimplements shared TaskRepository"]
    DDataSource["TaskDataSource.kt"]
    DEntry -->|"creates"| DRepository
    DRepository --> DDataSource
  end

  subgraph KMP[":sharedPresentation\nKMP library module"]
    direction TB
    App["App.kt\nCompose UI"]
    VM["HomeViewModel\ndefined in App.kt"]
    State["HomeUiState\ndefined in App.kt"]
    RepositoryPort["TaskRepository\nshared contract in App.kt"]
    App -->|"creates + calls"| VM
    App -->|"renders"| State
    VM -->|"returns"| State
    VM -->|"calls"| RepositoryPort
  end

  DEntry -->|"hosts + injects repository"| KMP
  IEntry -->|"hosts + injects repository"| KMP
  AEntry -->|"hosts + injects repository"| KMP

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,ARepository,ADataSource,IEntry,IRepository,IDataSource,DEntry,DRepository,DDataSource app;
  class App,VM,State,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
