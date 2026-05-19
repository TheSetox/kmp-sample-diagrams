# 11. Modular KMP Presentation Layer

Feature two shares presentation logic. UI and data implementations remain platform-specific.

```mermaid
flowchart LR
  subgraph Android["androidApp native"]
    AndroidUI["feature-two UI"]
    AndroidData["feature-two repository implementation"]
  end

  subgraph IOS["iosApp native"]
    IOSUI["feature-two UI"]
    IOSData["feature-two repository implementation"]
  end

  subgraph Desktop["desktopApp native"]
    DesktopUI["feature-two UI"]
    DesktopData["feature-two repository implementation"]
  end

  subgraph KMP["featureTwoSharedPresentation KMP module"]
    direction LR
    VM["ViewModel"]
    UseCase["UseCase"]
    RepositoryPort["Repository contract"]
    VM --> UseCase --> RepositoryPort
  end

  AndroidUI --> VM
  IOSUI --> VM
  DesktopUI --> VM
  RepositoryPort -. "implemented by native" .-> AndroidData
  RepositoryPort -. "implemented by native" .-> IOSData
  RepositoryPort -. "implemented by native" .-> DesktopData

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidUI,IOSUI,DesktopUI,AndroidData,IOSData,DesktopData app;
  class VM,UseCase,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
