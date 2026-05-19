# 06. KMP Presentation Layer

Presentation state and actions are shared. UI and data implementations remain platform-specific.

```mermaid
flowchart LR
  SharedPresentation["sharedPresentation\nKMP library\npresenters + state + actions"]

  AndroidUI["androidApp\nCompose UI"]
  IOSUI["iosApp\nSwiftUI"]
  DesktopUI["desktopApp\nCompose Desktop UI"]

  AndroidData["Android data"]
  IOSData["iOS data"]
  DesktopData["Desktop data"]

  AndroidUI --> SharedPresentation
  IOSUI --> SharedPresentation
  DesktopUI --> SharedPresentation

  SharedPresentation -. "repository contract" .-> AndroidData
  SharedPresentation -. "repository contract" .-> IOSData
  SharedPresentation -. "repository contract" .-> DesktopData

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidUI,IOSUI,DesktopUI,AndroidData,IOSData,DesktopData app;
  class SharedPresentation shared;
```

