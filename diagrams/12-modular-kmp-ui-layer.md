# 12. Modular KMP UI Layer

Feature two shares Compose UI only. Presentation and data stay in app modules.

```mermaid
flowchart LR
  SharedF2UI["feature-two:sharedUI\nKMP library\nCompose screens"]

  subgraph Android["androidApp"]
    AHost["feature-two host"]
    AP["feature-two presentation"]
    AD["feature-two data"]
    AP --> AD
  end

  subgraph IOS["iosApp"]
    IHost["feature-two host"]
    IP["feature-two presentation"]
    ID["feature-two data"]
    IP --> ID
  end

  subgraph Desktop["desktopApp"]
    DHost["feature-two host"]
    DP["feature-two presentation"]
    DD["feature-two data"]
    DP --> DD
  end

  AHost --> SharedF2UI
  IHost --> SharedF2UI
  DHost --> SharedF2UI
  SharedF2UI -. "events + state" .-> AP
  SharedF2UI -. "events + state" .-> IP
  SharedF2UI -. "events + state" .-> DP

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AHost,AP,AD,IHost,IP,ID,DHost,DP,DD app;
  class SharedF2UI shared;
```
