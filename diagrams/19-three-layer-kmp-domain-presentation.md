# 19. Three Layer KMP Domain And Presentation

Domain and presentation are shared. Data remains platform-specific.

```mermaid
flowchart LR
  subgraph Android["androidApp native"]
    AndroidUI["Android UI"]
    AndroidData["Android repository implementation"]
  end

  subgraph IOS["iosApp native"]
    IOSUI["SwiftUI"]
    IOSData["iOS repository implementation"]
  end

  subgraph Desktop["desktopApp native"]
    DesktopUI["Desktop UI"]
    DesktopData["Desktop repository implementation"]
  end

  subgraph Presentation["sharedPresentation KMP module"]
    direction LR
    VM["ViewModel"]
    State["UI state"]
    VM --> State
  end

  subgraph Domain["sharedDomain KMP module"]
    direction LR
    UseCase["UseCase"]
    Entity["Domain entity"]
    RepositoryPort["Repository contract"]
    UseCase --> Entity
    UseCase --> RepositoryPort
  end

  AndroidUI --> VM
  IOSUI --> VM
  DesktopUI --> VM
  VM --> UseCase

  RepositoryPort -. "implemented by native" .-> AndroidData
  RepositoryPort -. "implemented by native" .-> IOSData
  RepositoryPort -. "implemented by native" .-> DesktopData

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidUI,AndroidData,IOSUI,IOSData,DesktopUI,DesktopData app;
  class VM,State,UseCase,Entity,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Presentation fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style Domain fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
