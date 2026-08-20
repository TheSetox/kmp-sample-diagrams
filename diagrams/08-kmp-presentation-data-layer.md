# 08. KMP Presentation And Data Layers

Presentation and data are shared. Presentation contains Compose UI and ViewModel; data contains repository and data sources.

```mermaid
flowchart TB
  subgraph Android["androidApp"]
    direction TB
    AndroidEntry["MainActivity.kt\nCompose host"]
  end

  subgraph IOS["iosApp"]
    direction TB
    IOSEntry["ContentView.swift\nSwiftUI / UIKit Compose host"]
  end

  subgraph Desktop["desktopApp"]
    direction TB
    DesktopEntry["Main.kt\nCompose Desktop host"]
  end

  subgraph Presentation["sharedPresentation KMP module"]
    direction LR
    App["App.kt\nCompose UI entry"]
    Screen["Compose UI\nimplemented in App.kt"]
    VM["HomeViewModel class\nin App.kt"]
    App --> Screen --> VM
  end

  subgraph Data["sharedData KMP module"]
    direction LR
    Repository["TaskRepository.kt"]
    Remote["RemoteTaskDataSource.kt"]
    Cache["LocalTaskDataSource.kt"]
    Repository --> Remote
    Repository --> Cache
  end

  AndroidEntry --> App
  IOSEntry --> App
  DesktopEntry --> App
  VM --> Repository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidEntry,IOSEntry,DesktopEntry app;
  class App,Screen,VM,Repository,Remote,Cache kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Presentation fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style Data fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
