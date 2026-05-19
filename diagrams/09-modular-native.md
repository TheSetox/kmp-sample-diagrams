# 09. Modular Native

Baseline modular architecture. Feature modules are duplicated per platform with no shared KMP code.

```mermaid
flowchart LR
  subgraph Android["androidApp"]
    AF1["feature-one\nUI + presentation + data"]
    AF2["feature-two\nUI + presentation + data"]
  end

  subgraph IOS["iosApp"]
    IF1["feature-one\nUI + presentation + data"]
    IF2["feature-two\nUI + presentation + data"]
  end

  subgraph Desktop["desktopApp"]
    DF1["feature-one\nUI + presentation + data"]
    DF2["feature-two\nUI + presentation + data"]
  end

  AF1 -. "same feature, separate code" .- IF1
  AF2 -. "same feature, separate code" .- DF2

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AF1,AF2,IF1,IF2,DF1,DF2 app;
```

