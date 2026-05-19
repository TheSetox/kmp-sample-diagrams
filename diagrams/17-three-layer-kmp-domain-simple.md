# 17. Three Layer KMP Domain Simple

Simplified domain-sharing view. The app modules depend on one shared domain KMP module.

```mermaid
flowchart LR
  subgraph Android["androidApp native"]
    AndroidUI["Android UI"]
  end

  subgraph IOS["iosApp native"]
    IOSUI["SwiftUI"]
  end

  subgraph Desktop["desktopApp native"]
    DesktopUI["Desktop UI"]
  end

  subgraph KMP["sharedDomain KMP module"]
    direction LR
    UseCase["UseCase"]
    Entity["Domain entity"]
    RepositoryPort["Repository contract"]
    UseCase --> Entity
    UseCase --> RepositoryPort
  end

  AndroidUI --> UseCase
  IOSUI --> UseCase
  DesktopUI --> UseCase

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidUI,IOSUI,DesktopUI app;
  class UseCase,Entity,RepositoryPort kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
