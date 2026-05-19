# 13. Modular KMP UI And Data Layers

Feature two shares UI and data as separate KMP modules. Presentation remains platform-specific.

```mermaid
flowchart LR
  subgraph Android["androidApp native"]
    AndroidVM["feature-two ViewModel"]
  end

  subgraph IOS["iosApp native"]
    IOSVM["feature-two ViewModel"]
  end

  subgraph Desktop["desktopApp native"]
    DesktopVM["feature-two ViewModel"]
  end

  subgraph UIKMP["featureTwoSharedUI KMP module"]
    direction LR
    App["Compose App"]
    Screen["feature-two shared screen"]
    Components["feature-two components"]
    App --> Screen --> Components
  end

  subgraph DataKMP["featureTwoSharedData KMP module"]
    direction LR
    Repository["Repository"]
    DataSource["DataSource"]
    Mapper["Mapper"]
    Repository --> DataSource --> Mapper
  end

  AndroidVM --> App
  IOSVM --> App
  DesktopVM --> App
  AndroidVM --> Repository
  IOSVM --> Repository
  DesktopVM --> Repository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidVM,IOSVM,DesktopVM app;
  class App,Screen,Components,Repository,DataSource,Mapper kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style UIKMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style DataKMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
