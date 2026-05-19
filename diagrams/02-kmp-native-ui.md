# 02. KMP Native UI

Shared Kotlin logic is used by every app, while each platform keeps its own native UI.

```mermaid
flowchart LR
  subgraph Android["androidApp native"]
    AEntry["MainActivity"]
    AUI["Compose screen"]
    AEntry --> AUI
  end

  subgraph IOS["iosApp native"]
    IEntry["SwiftUI App"]
    IUI["SwiftUI view"]
    IEntry --> IUI
  end

  subgraph Desktop["desktopApp native"]
    DEntry["main()"]
    DUI["Compose Desktop screen"]
    DEntry --> DUI
  end

  subgraph KMP["sharedLogic KMP module"]
    direction LR
    VM["ViewModel\nstate and events"]
    UseCase["UseCase\nbusiness rules"]
    Repository["Repository\nshared contract"]
    DataSource["DataSource\nnetwork or cache"]
    VM --> UseCase --> Repository --> DataSource
  end

  AUI --> VM
  IUI --> VM
  DUI --> VM

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,AUI,IEntry,IUI,DEntry,DUI app;
  class VM,UseCase,Repository,DataSource kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
