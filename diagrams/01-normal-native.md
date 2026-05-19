# 01. Normal Native

Baseline with separate platform apps. There is no shared KMP module.

```mermaid
flowchart LR
  Android["androidApp\nAndroid entry point\nCompose UI + logic + data"]
  IOS["iosApp\niOS entry point\nSwiftUI + logic + data"]
  Desktop["desktopApp\nDesktop entry point\nCompose Desktop UI + logic + data"]

  Android -. "same feature, separate code" .- IOS
  IOS -. "same feature, separate code" .- Desktop

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class Android,IOS,Desktop app;
```

