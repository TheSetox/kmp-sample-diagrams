# 01. Normal Native

Baseline with separate platform app targets. There is no shared KMP module.

```mermaid
flowchart TB
  subgraph Android["androidApp app target"]
    direction TB
    AUI["HomeScreen.kt\nCompose UI"]
    AVM["HomeViewModel.kt"]
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    AUI --> AVM --> ARepository --> ADataSource
  end

  subgraph IOS["iosApp app target"]
    direction TB
    IUI["ContentView.swift\nSwiftUI"]
    IVM["HomeViewModel.swift"]
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IUI --> IVM --> IRepository --> IDataSource
  end

  subgraph Desktop["desktopApp app target"]
    direction TB
    DUI["HomeWindow.kt\nCompose Desktop UI"]
    DVM["HomeViewModel.kt"]
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DUI --> DVM --> DRepository --> DDataSource
  end

  ADataSource ~~~ IUI
  IDataSource ~~~ DUI

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AUI,AVM,ARepository,ADataSource,IUI,IVM,IRepository,IDataSource,DUI,DVM,DRepository,DDataSource app;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
```
