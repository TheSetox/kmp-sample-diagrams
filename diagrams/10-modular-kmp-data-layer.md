# 10. Modular KMP Data Layer

Feature two shares only its data layer. Feature one remains platform-specific.

```mermaid
flowchart LR
  SharedF2Data["feature-two:sharedData\nKMP library"]

  subgraph Android["androidApp"]
    AF1["feature-one native"]
    AF2UI["feature-two UI"]
    AF2P["feature-two presentation"]
    AF2UI --> AF2P
  end

  subgraph IOS["iosApp"]
    IF1["feature-one native"]
    IF2UI["feature-two UI"]
    IF2P["feature-two presentation"]
    IF2UI --> IF2P
  end

  subgraph Desktop["desktopApp"]
    DF1["feature-one native"]
    DF2UI["feature-two UI"]
    DF2P["feature-two presentation"]
    DF2UI --> DF2P
  end

  AF2P --> SharedF2Data
  IF2P --> SharedF2Data
  DF2P --> SharedF2Data

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AF1,AF2UI,AF2P,IF1,IF2UI,IF2P,DF1,DF2UI,DF2P app;
  class SharedF2Data shared;
```

