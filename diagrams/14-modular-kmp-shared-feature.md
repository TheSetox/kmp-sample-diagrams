# 14. Modular KMP Shared Feature

Feature two is consolidated into one shared KMP feature module.

```mermaid
flowchart LR
  subgraph Android["androidApp native shell"]
    AEntry["Android entry point"]
    AFeatureOne["feature-one native"]
    AEntry --> AFeatureOne
  end

  subgraph IOS["iosApp native shell"]
    IEntry["iOS entry point"]
    IFeatureOne["feature-one native"]
    IEntry --> IFeatureOne
  end

  subgraph Desktop["desktopApp native shell"]
    DEntry["Desktop entry point"]
    DFeatureOne["feature-one native"]
    DEntry --> DFeatureOne
  end

  subgraph KMP["featureTwoSharedFeature KMP module"]
    direction LR
    App["feature-two Compose App"]
    VM["feature-two ViewModel"]
    UseCase["feature-two UseCase"]
    Repository["feature-two Repository"]
    DataSource["feature-two DataSource"]
    App --> VM --> UseCase --> Repository --> DataSource
  end

  AEntry --> App
  IEntry --> App
  DEntry --> App

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AEntry,AFeatureOne,IEntry,IFeatureOne,DEntry,DFeatureOne app;
  class App,VM,UseCase,Repository,DataSource kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style KMP fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
