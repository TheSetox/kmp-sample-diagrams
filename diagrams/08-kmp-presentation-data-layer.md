# 08. KMP Presentation And Data Layers

Presentation and data are shared. Presentation contains Compose UI and ViewModel; data contains repository and data sources.

```mermaid
flowchart TB
  subgraph Android[":androidApp\nAndroid app module"]
    direction TB
    AndroidEntry["MainActivity.kt\nCompose host"]
  end

  subgraph IOS["iosApp\niOS Xcode target"]
    direction TB
    IOSEntry["ContentView.swift\nSwiftUI / UIKit Compose host"]
  end

  subgraph Desktop[":desktopApp\nDesktop app module"]
    direction TB
    DesktopEntry["Main.kt\nCompose Desktop host"]
  end

  subgraph Presentation[":sharedPresentation\nKMP library module"]
    direction LR
    App["App.kt\nCompose UI entry"]
    Screen["Compose UI\nimplemented in App.kt"]
    VM["HomeViewModel class\nin App.kt"]
    State["HomeUiState\ndefined in App.kt"]
    App --> Screen --> VM
    VM -->|"returns"| State
  end

  subgraph Data[":sharedData\nKMP library module"]
    direction LR
    Repository["TaskRepository.kt"]
    Remote["RemoteTaskDataSource.kt"]
    Cache["LocalTaskDataSource.kt"]
    Mapper["TaskDtoMapper.kt"]
    Repository --> Remote
    Repository --> Cache
    Repository -->|"maps results"| Mapper
  end

  DesktopEntry -->|"hosts shared UI"| App
  IOSEntry -->|"hosts shared UI"| App
  AndroidEntry -->|"hosts shared UI"| App
  VM -->|"uses shared data"| Repository

  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  classDef kmp fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;
  class AndroidEntry,IOSEntry,DesktopEntry app;
  class App,Screen,VM,State,Repository,Remote,Cache,Mapper kmp;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:3px
  style Presentation fill:#fff7cc,stroke:#9b7415,stroke-width:3px
  style Data fill:#fff7cc,stroke:#9b7415,stroke-width:3px
```
