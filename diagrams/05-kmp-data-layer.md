# 05. KMP Data Layer

The data layer is shared in a KMP library. UI and presentation remain platform-specific.

```mermaid
flowchart LR
  subgraph Android["androidApp"]
    AUI["Android UI"]
    AVM["Android ViewModel"]
    AUseCase["Android UseCase"]
    AUI --> AVM --> AUseCase
  end

  subgraph IOS["iosApp"]
    IUI["SwiftUI"]
    IVM["iOS ViewModel"]
    IUseCase["iOS UseCase"]
    IUI --> IVM --> IUseCase
  end

  subgraph Desktop["desktopApp"]
    DUI["Desktop UI"]
    DVM["Desktop ViewModel"]
    DUseCase["Desktop UseCase"]
    DUI --> DVM --> DUseCase
  end

  subgraph KMP["sharedData KMP module"]
    direction LR
    Repository["Repository"]
    Remote["Remote data source"]
    Cache["Cache data source"]
    Mapper["DTO mapper"]
    Repository --> Remote
    Repository --> Cache
    Remote --> Mapper
    Cache --> Mapper
  end

  AUseCase --> Repository
  IUseCase --> Repository
  DUseCase --> Repository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AUI,AVM,AUseCase,IUI,IVM,IUseCase,DUI,DVM,DUseCase app;
  class Repository,Remote,Cache,Mapper kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
