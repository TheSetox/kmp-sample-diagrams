# 07. KMP UI Layer

Only Compose UI is shared with Compose Multiplatform. Native ViewModels call native repositories and data sources.

```mermaid
flowchart LR
  subgraph Android["androidApp native"]
    AHost["MainActivity"]
    AVM["HomeViewModel.kt"]
    ARepository["TaskRepository.kt"]
    ADataSource["TaskDataSource.kt"]
    AVM --> ARepository --> ADataSource
  end

  subgraph IOS["iosApp native"]
    IHost["SwiftUI App"]
    IVM["HomeViewModel.swift"]
    IRepository["TaskRepository.swift"]
    IDataSource["TaskDataSource.swift"]
    IVM --> IRepository --> IDataSource
  end

  subgraph Desktop["desktopApp native"]
    DHost["main()"]
    DVM["HomeViewModel.kt"]
    DRepository["TaskRepository.kt"]
    DDataSource["TaskDataSource.kt"]
    DVM --> DRepository --> DDataSource
  end

  subgraph KMP["sharedUI KMP module"]
    direction LR
    App["Compose App"]
    Screen["HomeScreen.kt"]
    Components["Design components"]
    App --> Screen --> Components
  end

  AHost --> App
  IHost --> App
  DHost --> App
  Screen -. "state and events" .-> AVM
  Screen -. "state and events" .-> IVM
  Screen -. "state and events" .-> DVM

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AHost,AVM,ARepository,ADataSource,IHost,IVM,IRepository,IDataSource,DHost,DVM,DRepository,DDataSource app;
  class App,Screen,Components kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
