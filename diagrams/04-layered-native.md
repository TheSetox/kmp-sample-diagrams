# 04. Layered Native

Baseline layered architecture. Each app target owns a presentation module and a data module. Presentation contains UI and ViewModel; there is no domain/use-case layer in this scenario.

```mermaid
flowchart TB
  subgraph Desktop["desktopApp"]
    direction TB
    subgraph DPresentation["presentation module"]
      direction TB
      DUI["HomeWindow.kt\nCompose Desktop UI"]
      DVM["HomeViewModel.kt"]
      DUI --> DVM
    end
    subgraph DData["data module"]
      direction TB
      DRepository["TaskRepository.kt"]
      DDataSource["TaskDataSource.kt"]
      DRepository --> DDataSource
    end
    DVM --> DRepository
  end

  subgraph IOS["iosApp"]
    direction TB
    subgraph IPresentation["presentation module"]
      direction TB
      IUI["ContentView.swift\nSwiftUI"]
      IVM["HomeViewModel.swift"]
      IUI --> IVM
    end
    subgraph IData["data module"]
      direction TB
      IRepository["TaskRepository.swift"]
      IDataSource["TaskDataSource.swift"]
      IRepository --> IDataSource
    end
    IVM --> IRepository
  end

  subgraph Android["androidApp"]
    direction TB
    subgraph APresentation["presentation module"]
      direction TB
      AUI["HomeScreen.kt\nCompose UI"]
      AVM["HomeViewModel.kt"]
      AUI --> AVM
    end
    subgraph AData["data module"]
      direction TB
      ARepository["TaskRepository.kt"]
      ADataSource["TaskDataSource.kt"]
      ARepository --> ADataSource
    end
    AVM --> ARepository
  end

  classDef native fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AUI,AVM,ARepository,ADataSource,IUI,IVM,IRepository,IDataSource,DUI,DVM,DRepository,DDataSource native;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style APresentation fill:#f4faff,stroke:#1f5f8b,stroke-width:1px
  style IPresentation fill:#f4faff,stroke:#1f5f8b,stroke-width:1px
  style DPresentation fill:#f4faff,stroke:#1f5f8b,stroke-width:1px
  style AData fill:#f4faff,stroke:#1f5f8b,stroke-width:1px
  style IData fill:#f4faff,stroke:#1f5f8b,stroke-width:1px
  style DData fill:#f4faff,stroke:#1f5f8b,stroke-width:1px
```
