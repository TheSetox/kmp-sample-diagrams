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
  subgraph Android[":androidApp\nAndroid app module"]
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

  subgraph IOS["iosApp\niOS Xcode target"]
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

  subgraph Desktop[":desktopApp\nDesktop app module"]
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

  classDef native fill:#f3f9fc,stroke:#2b6f9e,color:#334155,stroke-width:1.4px;
  class AUI,AVM,ARepository,ADataSource,IUI,IVM,IRepository,IDataSource,DUI,DVM,DRepository,DDataSource native;
  style Android fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style IOS fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style Desktop fill:#fff8eb,stroke:#c47a12,stroke-width:1.6px
  style APresentation fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IPresentation fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DPresentation fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style AData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style IData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
  style DData fill:#f8fbfd,stroke:#8aa7bc,stroke-width:1.2px,stroke-dasharray:5 4
```
