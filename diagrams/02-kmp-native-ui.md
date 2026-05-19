# 02. KMP Native UI

Shared Kotlin logic is used by every app, while each platform keeps its own UI.

```mermaid
flowchart LR
  Shared["sharedLogic\nKMP library\ncommonMain: state + use cases + repository contracts"]

  Android["androidApp\nAndroid entry point\nCompose UI"]
  IOS["iosApp\niOS entry point\nSwiftUI"]
  Desktop["desktopApp\nDesktop entry point\nCompose Desktop UI"]

  Android --> Shared
  IOS --> Shared
  Desktop --> Shared

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class Android,IOS,Desktop app;
  class Shared shared;
```

