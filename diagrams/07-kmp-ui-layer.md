# 07. KMP UI Layer

Only the UI layer is shared with Compose Multiplatform. Presentation and data are provided by each app.

```mermaid
flowchart LR
  subgraph Android["androidApp"]
    AHost["Android entry point"]
    AVM["Android ViewModel"]
    AUseCase["Android UseCase"]
    ARepository["Android repository"]
    AVM --> AUseCase --> ARepository
  end

  subgraph IOS["iosApp"]
    IHost["iOS entry point"]
    IVM["iOS ViewModel"]
    IUseCase["iOS UseCase"]
    IRepository["iOS repository"]
    IVM --> IUseCase --> IRepository
  end

  subgraph Desktop["desktopApp"]
    DHost["Desktop entry point"]
    DVM["Desktop ViewModel"]
    DUseCase["Desktop UseCase"]
    DRepository["Desktop repository"]
    DVM --> DUseCase --> DRepository
  end

  subgraph KMP["sharedUI KMP module"]
    direction LR
    App["Compose App"]
    Screen["Shared screen"]
    Components["Shared components"]
    App --> Screen --> Components
  end

  AHost --> App
  IHost --> App
  DHost --> App
  Screen -. "events and state" .-> AVM
  Screen -. "events and state" .-> IVM
  Screen -. "events and state" .-> DVM

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AHost,AVM,AUseCase,ARepository,IHost,IVM,IUseCase,IRepository,DHost,DVM,DUseCase,DRepository app;
  class App,Screen,Components kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
