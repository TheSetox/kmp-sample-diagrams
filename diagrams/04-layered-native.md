# 04. Layered Native

Baseline layered architecture with platform-specific UI and data layers.

```mermaid
flowchart TB
  subgraph Android["androidApp"]
    AUI["UI"]
    AData["Data"]
    AUI --> AData
  end

  subgraph IOS["iosApp"]
    IUI["UI"]
    IData["Data"]
    IUI --> IData
  end

  subgraph Desktop["desktopApp"]
    DUI["UI"]
    DData["Data"]
    DUI --> DData
  end

  classDef layer fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AUI,AData,IUI,IData,DUI,DData layer;
```

