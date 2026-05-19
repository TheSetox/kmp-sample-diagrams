# 14. Modular KMP Shared Feature

Feature two is consolidated into one shared KMP feature module.

```mermaid
flowchart LR
  SharedFeature["feature-two:sharedFeature\nKMP library\nUI + presentation + data"]

  Android["androidApp\nentry point + feature host"]
  IOS["iosApp\nentry point + feature host"]
  Desktop["desktopApp\nentry point + feature host"]

  Android --> SharedFeature
  IOS --> SharedFeature
  Desktop --> SharedFeature

  FeatureOneA["feature-one native Android"]
  FeatureOneI["feature-one native iOS"]
  FeatureOneD["feature-one native Desktop"]

  Android --> FeatureOneA
  IOS --> FeatureOneI
  Desktop --> FeatureOneD

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class Android,IOS,Desktop,FeatureOneA,FeatureOneI,FeatureOneD app;
  class SharedFeature shared;
```

