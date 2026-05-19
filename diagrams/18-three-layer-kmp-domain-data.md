# 18. Three Layer KMP Domain And Data

Domain and data are shared. Platform app modules own the UI.

```mermaid
flowchart LR
  SharedDomain["sharedDomain\nKMP library\nuse cases + entities"]
  SharedData["sharedData\nKMP library\nrepositories + data sources"]
  SharedDomain --> SharedData

  Android["androidApp\nAndroid UI"]
  IOS["iosApp\nSwiftUI"]
  Desktop["desktopApp\nDesktop UI"]

  Android --> SharedDomain
  IOS --> SharedDomain
  Desktop --> SharedDomain

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class Android,IOS,Desktop app;
  class SharedDomain,SharedData shared;
```

