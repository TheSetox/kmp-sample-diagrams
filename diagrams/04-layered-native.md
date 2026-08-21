# 04. Layered Native

Baseline layered architecture. Each app target owns presentation and data layers. These layers are app-owned code groupings, not separate build modules. Presentation contains UI and ViewModel; there is no domain/use-case layer in this scenario.

```mermaid
---
config:
  layout: elk
  elk:
    nodePlacementStrategy: LINEAR_SEGMENTS
---
flowchart TB
  subgraph Android[":androidApp · Android app module"]
    direction TB
    subgraph APresentation["Presentation layer\napp-owned code"]
      direction TB
      AUI["MainActivity.kt\nAndroid TextView UI"]
      AVM["HomeViewModel.kt"]
      AUI --> AVM
    end
    subgraph AData["Data layer\napp-owned code"]
      direction TB
      ARepository["TaskRepository.kt"]
      ADataSource["TaskDataSource.kt"]
      ARepository --> ADataSource
    end
    AVM -->|"uses data layer"| AData
  end

  subgraph IOS["iosApp · iOS Xcode target"]
    direction TB
    subgraph IPresentation["Presentation layer\napp-owned code"]
      direction TB
      IUI["ContentView.swift\nSwiftUI"]
      IVM["HomeViewModel.swift"]
      IUI --> IVM
    end
    subgraph IData["Data layer\napp-owned code"]
      direction TB
      IRepository["TaskRepository.swift"]
      IDataSource["TaskDataSource.swift"]
      IRepository --> IDataSource
    end
    IVM -->|"uses data layer"| IData
  end

  subgraph Desktop[":desktopApp · Desktop app module"]
    direction TB
    subgraph DPresentation["Presentation layer\napp-owned code"]
      direction TB
      DUI["Main.kt\nCompose Desktop UI"]
      DVM["HomeViewModel.kt"]
      DUI --> DVM
    end
    subgraph DData["Data layer\napp-owned code"]
      direction TB
      DRepository["TaskRepository.kt"]
      DDataSource["TaskDataSource.kt"]
      DRepository --> DDataSource
    end
    DVM -->|"uses data layer"| DData
  end

  classDef native fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AUI,AVM,ARepository,ADataSource,IUI,IVM,IRepository,IDataSource,DUI,DVM,DRepository,DDataSource native;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style APresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DPresentation fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style AData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style IData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
  style DData fill:#f6fbff,stroke:#5f97bd,stroke-width:1.5px,stroke-dasharray:6 4
```
