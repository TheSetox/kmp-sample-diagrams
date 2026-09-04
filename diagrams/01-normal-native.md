# 01. Normal Native

Baseline with separate platform app targets. There is no shared KMP module.

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
    AUI["MainActivity.kt\nAndroid TextView UI"]
    AVM["HomeViewModel.kt"]
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    AUI --> AVM --> ARepository --> ADataSource
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    IUI["ContentView.swift\nSwiftUI"]
    IVM["HomeViewModel.swift"]
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IUI --> IVM --> IRepository --> IDataSource
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    DUI["Main.kt\nCompose Desktop UI"]
    DVM["HomeViewModel.kt"]
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DUI --> DVM --> DRepository --> DDataSource
  end

  classDef app fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  class AUI,AVM,ARepository,ADataSource,IUI,IVM,IRepository,IDataSource,DUI,DVM,DRepository,DDataSource app;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
```
