# 05. KMP Data Layer

The data layer is shared in a KMP module. Each app target keeps native presentation code: UI plus ViewModel.

```mermaid
flowchart TB
  subgraph Android[":androidApp\nAndroid app module"]
    direction TB
    AUI["MainActivity.kt\nAndroid TextView UI"]
    AVM["HomeViewModel.kt"]
    AUI --> AVM
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    IUI["ContentView.swift\nSwiftUI"]
    IVM["HomeViewModel.swift"]
    IUI --> IVM
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    DUI["Main.kt\nCompose Desktop UI"]
    DVM["HomeViewModel.kt"]
    DUI --> DVM
  end

  subgraph KMP[":sharedData\nKMP library module"]
    direction LR
    Repository["TaskRepository.kt"]
    Remote["RemoteTaskDataSource.kt"]
    Cache["LocalTaskDataSource.kt"]
    Mapper["TaskDtoMapper.kt"]
    Repository --> Remote
    Repository --> Cache
    Repository -->|"maps results"| Mapper
  end

  DVM -->|"uses shared data"| KMP
  IVM -->|"uses shared data"| KMP
  AVM -->|"uses shared data"| KMP

  classDef app fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  classDef kmp fill:#f8f5fe,stroke:#6e4bae,color:#334155,stroke-width:1.4px;
  class AUI,AVM,IUI,IVM,DUI,DVM app;
  class Repository,Remote,Cache,Mapper kmp;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style KMP fill:#f8f5fe,stroke:#6e4bae,stroke-width:1.6px
```
