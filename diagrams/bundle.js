window.KMP_DIAGRAM_BUNDLE = {
  "manifest": [
    {
      "title": "Normal Native",
      "category": "Baselines",
      "file": "01-normal-native.md",
      "sample": "samples/normal-native"
    },
    {
      "title": "KMP Native UI",
      "category": "Main KMP",
      "file": "02-kmp-native-ui.md",
      "sample": "samples/kmp-native-ui"
    },
    {
      "title": "KMP Compose UI",
      "category": "Main KMP",
      "file": "03-kmp-compose-ui.md",
      "sample": "samples/kmp-compose-ui"
    },
    {
      "title": "Layered Native",
      "category": "Baselines",
      "file": "04-layered-native.md",
      "sample": "samples/layered-native"
    },
    {
      "title": "KMP Data Layer",
      "category": "Main KMP",
      "file": "05-kmp-data-layer.md",
      "sample": "samples/kmp-data-layer"
    },
    {
      "title": "KMP Presentation Layer",
      "category": "Main KMP",
      "file": "06-kmp-presentation-layer.md",
      "sample": "samples/kmp-presentation-layer"
    },
    {
      "title": "KMP UI Layer",
      "category": "Main KMP",
      "file": "07-kmp-ui-layer.md",
      "sample": "samples/kmp-ui-layer"
    },
    {
      "title": "KMP Presentation And Data Layers",
      "category": "Main KMP",
      "file": "08-kmp-presentation-data-layer.md",
      "sample": "samples/kmp-presentation-data-layer"
    },
    {
      "title": "Modular Native",
      "category": "Baselines",
      "file": "09-modular-native.md",
      "sample": "samples/modular-native"
    },
    {
      "title": "Modular KMP Data Layer",
      "category": "Modular KMP",
      "file": "10-modular-kmp-data-layer.md",
      "sample": "samples/modular-kmp-data-layer"
    },
    {
      "title": "Modular KMP Presentation Layer",
      "category": "Modular KMP",
      "file": "11-modular-kmp-presentation-layer.md",
      "sample": "samples/modular-kmp-presentation-layer"
    },
    {
      "title": "Modular KMP UI Layer",
      "category": "Modular KMP",
      "file": "12-modular-kmp-ui-layer.md",
      "sample": "samples/modular-kmp-ui-layer"
    },
    {
      "title": "Modular KMP UI And Data Layers",
      "category": "Modular KMP",
      "file": "13-modular-kmp-ui-data-layer.md",
      "sample": "samples/modular-kmp-ui-data-layer"
    },
    {
      "title": "Modular KMP Shared Feature",
      "category": "Modular KMP",
      "file": "14-modular-kmp-shared-feature.md",
      "sample": "samples/modular-kmp-shared-feature"
    },
    {
      "title": "Three Layer Native",
      "category": "Baselines",
      "file": "15-three-layer-native.md",
      "sample": "samples/three-layer-native"
    },
    {
      "title": "Three Layer KMP Domain",
      "category": "Three Layer KMP",
      "file": "16-three-layer-kmp-domain.md",
      "sample": "samples/three-layer-kmp-domain"
    },
    {
      "title": "Three Layer KMP Domain Simple",
      "category": "Three Layer KMP",
      "file": "17-three-layer-kmp-domain-simple.md",
      "sample": "samples/three-layer-kmp-domain-simple"
    },
    {
      "title": "Three Layer KMP Domain And Data",
      "category": "Three Layer KMP",
      "file": "18-three-layer-kmp-domain-data.md",
      "sample": "samples/three-layer-kmp-domain-data"
    },
    {
      "title": "Three Layer KMP Domain And Presentation",
      "category": "Three Layer KMP",
      "file": "19-three-layer-kmp-domain-presentation.md",
      "sample": "samples/three-layer-kmp-domain-presentation"
    }
  ],
  "diagrams": {
    "01-normal-native.md": "# 01. Normal Native\n\nBaseline with separate platform apps. There is no shared KMP module.\n\n```mermaid\nflowchart LR\n  Android[\"androidApp\\nAndroid entry point\\nCompose UI + logic + data\"]\n  IOS[\"iosApp\\niOS entry point\\nSwiftUI + logic + data\"]\n  Desktop[\"desktopApp\\nDesktop entry point\\nCompose Desktop UI + logic + data\"]\n\n  Android -. \"same feature, separate code\" .- IOS\n  IOS -. \"same feature, separate code\" .- Desktop\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  class Android,IOS,Desktop app;\n```\n\n",
    "02-kmp-native-ui.md": "# 02. KMP Native UI\n\nShared Kotlin logic is used by every app, while each platform keeps its own UI.\n\n```mermaid\nflowchart LR\n  Shared[\"sharedLogic\\nKMP library\\ncommonMain: state + use cases + repository contracts\"]\n\n  Android[\"androidApp\\nAndroid entry point\\nCompose UI\"]\n  IOS[\"iosApp\\niOS entry point\\nSwiftUI\"]\n  Desktop[\"desktopApp\\nDesktop entry point\\nCompose Desktop UI\"]\n\n  Android --> Shared\n  IOS --> Shared\n  Desktop --> Shared\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop app;\n  class Shared shared;\n```\n\n",
    "03-kmp-compose-ui.md": "# 03. KMP Compose UI\n\nAll platform entry points are separate app modules. Shared Compose UI and shared logic live in the `shared` KMP library.\n\n```mermaid\nflowchart LR\n  Shared[\"shared\\nKMP library\\ncommonMain: App(), UI state, data access\"]\n\n  Android[\"androidApp\\nAndroid entry point\"]\n  IOS[\"iosApp\\niOS entry point\"]\n  Desktop[\"desktopApp\\nDesktop entry point\"]\n\n  Android --> Shared\n  IOS --> Shared\n  Desktop --> Shared\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop app;\n  class Shared shared;\n```\n\n",
    "04-layered-native.md": "# 04. Layered Native\n\nBaseline layered architecture with platform-specific UI and data layers.\n\n```mermaid\nflowchart TB\n  subgraph Android[\"androidApp\"]\n    AUI[\"UI\"]\n    AData[\"Data\"]\n    AUI --> AData\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IUI[\"UI\"]\n    IData[\"Data\"]\n    IUI --> IData\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DUI[\"UI\"]\n    DData[\"Data\"]\n    DUI --> DData\n  end\n\n  classDef layer fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  class AUI,AData,IUI,IData,DUI,DData layer;\n```\n\n",
    "05-kmp-data-layer.md": "# 05. KMP Data Layer\n\nThe data layer is shared in a KMP library. UI and presentation remain platform-specific.\n\n```mermaid\nflowchart LR\n  SharedData[\"sharedData\\nKMP library\\nrepositories + data sources\"]\n\n  subgraph Android[\"androidApp\"]\n    AUI[\"Android UI\"]\n    APresentation[\"Android presentation\"]\n    AUI --> APresentation\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IUI[\"SwiftUI\"]\n    IPresentation[\"iOS presentation\"]\n    IUI --> IPresentation\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DUI[\"Desktop UI\"]\n    DPresentation[\"Desktop presentation\"]\n    DUI --> DPresentation\n  end\n\n  APresentation --> SharedData\n  IPresentation --> SharedData\n  DPresentation --> SharedData\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AUI,APresentation,IUI,IPresentation,DUI,DPresentation app;\n  class SharedData shared;\n```\n\n",
    "06-kmp-presentation-layer.md": "# 06. KMP Presentation Layer\n\nPresentation state and actions are shared. UI and data implementations remain platform-specific.\n\n```mermaid\nflowchart LR\n  SharedPresentation[\"sharedPresentation\\nKMP library\\npresenters + state + actions\"]\n\n  AndroidUI[\"androidApp\\nCompose UI\"]\n  IOSUI[\"iosApp\\nSwiftUI\"]\n  DesktopUI[\"desktopApp\\nCompose Desktop UI\"]\n\n  AndroidData[\"Android data\"]\n  IOSData[\"iOS data\"]\n  DesktopData[\"Desktop data\"]\n\n  AndroidUI --> SharedPresentation\n  IOSUI --> SharedPresentation\n  DesktopUI --> SharedPresentation\n\n  SharedPresentation -. \"repository contract\" .-> AndroidData\n  SharedPresentation -. \"repository contract\" .-> IOSData\n  SharedPresentation -. \"repository contract\" .-> DesktopData\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AndroidUI,IOSUI,DesktopUI,AndroidData,IOSData,DesktopData app;\n  class SharedPresentation shared;\n```\n\n",
    "07-kmp-ui-layer.md": "# 07. KMP UI Layer\n\nOnly the UI layer is shared with Compose Multiplatform. Presentation and data are provided by each app.\n\n```mermaid\nflowchart LR\n  SharedUI[\"sharedUI\\nKMP library\\nCompose screens + components\"]\n\n  subgraph Android[\"androidApp\"]\n    AHost[\"Android entry point\"]\n    APresentation[\"Android presentation\"]\n    AData[\"Android data\"]\n    APresentation --> AData\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IHost[\"iOS entry point\"]\n    IPresentation[\"iOS presentation\"]\n    IData[\"iOS data\"]\n    IPresentation --> IData\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DHost[\"Desktop entry point\"]\n    DPresentation[\"Desktop presentation\"]\n    DData[\"Desktop data\"]\n    DPresentation --> DData\n  end\n\n  AHost --> SharedUI\n  IHost --> SharedUI\n  DHost --> SharedUI\n  SharedUI -. \"events + state\" .-> APresentation\n  SharedUI -. \"events + state\" .-> IPresentation\n  SharedUI -. \"events + state\" .-> DPresentation\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AHost,APresentation,AData,IHost,IPresentation,IData,DHost,DPresentation,DData app;\n  class SharedUI shared;\n```\n",
    "08-kmp-presentation-data-layer.md": "# 08. KMP Presentation And Data Layers\n\nPresentation and data are shared. Platform app modules keep the entry points and host the UI.\n\n```mermaid\nflowchart LR\n  SharedPresentation[\"sharedPresentation\\nKMP library\\nstate + actions\"]\n  SharedData[\"sharedData\\nKMP library\\nrepositories + data sources\"]\n  SharedPresentation --> SharedData\n\n  Android[\"androidApp\\nAndroid UI\"]\n  IOS[\"iosApp\\nSwiftUI\"]\n  Desktop[\"desktopApp\\nDesktop UI\"]\n\n  Android --> SharedPresentation\n  IOS --> SharedPresentation\n  Desktop --> SharedPresentation\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop app;\n  class SharedPresentation,SharedData shared;\n```\n\n",
    "09-modular-native.md": "# 09. Modular Native\n\nBaseline modular architecture. Feature modules are duplicated per platform with no shared KMP code.\n\n```mermaid\nflowchart LR\n  subgraph Android[\"androidApp\"]\n    AF1[\"feature-one\\nUI + presentation + data\"]\n    AF2[\"feature-two\\nUI + presentation + data\"]\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IF1[\"feature-one\\nUI + presentation + data\"]\n    IF2[\"feature-two\\nUI + presentation + data\"]\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DF1[\"feature-one\\nUI + presentation + data\"]\n    DF2[\"feature-two\\nUI + presentation + data\"]\n  end\n\n  AF1 -. \"same feature, separate code\" .- IF1\n  AF2 -. \"same feature, separate code\" .- DF2\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  class AF1,AF2,IF1,IF2,DF1,DF2 app;\n```\n\n",
    "10-modular-kmp-data-layer.md": "# 10. Modular KMP Data Layer\n\nFeature two shares only its data layer. Feature one remains platform-specific.\n\n```mermaid\nflowchart LR\n  SharedF2Data[\"feature-two:sharedData\\nKMP library\"]\n\n  subgraph Android[\"androidApp\"]\n    AF1[\"feature-one native\"]\n    AF2UI[\"feature-two UI\"]\n    AF2P[\"feature-two presentation\"]\n    AF2UI --> AF2P\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IF1[\"feature-one native\"]\n    IF2UI[\"feature-two UI\"]\n    IF2P[\"feature-two presentation\"]\n    IF2UI --> IF2P\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DF1[\"feature-one native\"]\n    DF2UI[\"feature-two UI\"]\n    DF2P[\"feature-two presentation\"]\n    DF2UI --> DF2P\n  end\n\n  AF2P --> SharedF2Data\n  IF2P --> SharedF2Data\n  DF2P --> SharedF2Data\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AF1,AF2UI,AF2P,IF1,IF2UI,IF2P,DF1,DF2UI,DF2P app;\n  class SharedF2Data shared;\n```\n\n",
    "11-modular-kmp-presentation-layer.md": "# 11. Modular KMP Presentation Layer\n\nFeature two shares presentation logic. UI and data implementations remain platform-specific.\n\n```mermaid\nflowchart LR\n  SharedF2Presentation[\"feature-two:sharedPresentation\\nKMP library\"]\n\n  AndroidUI[\"androidApp\\nfeature-two UI\"]\n  IOSUI[\"iosApp\\nfeature-two UI\"]\n  DesktopUI[\"desktopApp\\nfeature-two UI\"]\n\n  AndroidData[\"Android feature-two data\"]\n  IOSData[\"iOS feature-two data\"]\n  DesktopData[\"Desktop feature-two data\"]\n\n  AndroidUI --> SharedF2Presentation\n  IOSUI --> SharedF2Presentation\n  DesktopUI --> SharedF2Presentation\n\n  SharedF2Presentation -. \"data contract\" .-> AndroidData\n  SharedF2Presentation -. \"data contract\" .-> IOSData\n  SharedF2Presentation -. \"data contract\" .-> DesktopData\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AndroidUI,IOSUI,DesktopUI,AndroidData,IOSData,DesktopData app;\n  class SharedF2Presentation shared;\n```\n\n",
    "12-modular-kmp-ui-layer.md": "# 12. Modular KMP UI Layer\n\nFeature two shares Compose UI only. Presentation and data stay in app modules.\n\n```mermaid\nflowchart LR\n  SharedF2UI[\"feature-two:sharedUI\\nKMP library\\nCompose screens\"]\n\n  subgraph Android[\"androidApp\"]\n    AHost[\"feature-two host\"]\n    AP[\"feature-two presentation\"]\n    AD[\"feature-two data\"]\n    AP --> AD\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IHost[\"feature-two host\"]\n    IP[\"feature-two presentation\"]\n    ID[\"feature-two data\"]\n    IP --> ID\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DHost[\"feature-two host\"]\n    DP[\"feature-two presentation\"]\n    DD[\"feature-two data\"]\n    DP --> DD\n  end\n\n  AHost --> SharedF2UI\n  IHost --> SharedF2UI\n  DHost --> SharedF2UI\n  SharedF2UI -. \"events + state\" .-> AP\n  SharedF2UI -. \"events + state\" .-> IP\n  SharedF2UI -. \"events + state\" .-> DP\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AHost,AP,AD,IHost,IP,ID,DHost,DP,DD app;\n  class SharedF2UI shared;\n```\n",
    "13-modular-kmp-ui-data-layer.md": "# 13. Modular KMP UI And Data Layers\n\nFeature two shares UI and data as separate KMP modules. Presentation remains platform-specific.\n\n```mermaid\nflowchart LR\n  SharedF2UI[\"feature-two:sharedUI\\nKMP library\"]\n  SharedF2Data[\"feature-two:sharedData\\nKMP library\"]\n\n  AndroidP[\"androidApp\\nfeature-two presentation\"]\n  IOSP[\"iosApp\\nfeature-two presentation\"]\n  DesktopP[\"desktopApp\\nfeature-two presentation\"]\n\n  AndroidP --> SharedF2UI\n  IOSP --> SharedF2UI\n  DesktopP --> SharedF2UI\n\n  AndroidP --> SharedF2Data\n  IOSP --> SharedF2Data\n  DesktopP --> SharedF2Data\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AndroidP,IOSP,DesktopP app;\n  class SharedF2UI,SharedF2Data shared;\n```\n\n",
    "14-modular-kmp-shared-feature.md": "# 14. Modular KMP Shared Feature\n\nFeature two is consolidated into one shared KMP feature module.\n\n```mermaid\nflowchart LR\n  SharedFeature[\"feature-two:sharedFeature\\nKMP library\\nUI + presentation + data\"]\n\n  Android[\"androidApp\\nentry point + feature host\"]\n  IOS[\"iosApp\\nentry point + feature host\"]\n  Desktop[\"desktopApp\\nentry point + feature host\"]\n\n  Android --> SharedFeature\n  IOS --> SharedFeature\n  Desktop --> SharedFeature\n\n  FeatureOneA[\"feature-one native Android\"]\n  FeatureOneI[\"feature-one native iOS\"]\n  FeatureOneD[\"feature-one native Desktop\"]\n\n  Android --> FeatureOneA\n  IOS --> FeatureOneI\n  Desktop --> FeatureOneD\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop,FeatureOneA,FeatureOneI,FeatureOneD app;\n  class SharedFeature shared;\n```\n\n",
    "15-three-layer-native.md": "# 15. Three Layer Native\n\nBaseline three-layer architecture with platform-specific UI, domain, and data.\n\n```mermaid\nflowchart TB\n  subgraph Android[\"androidApp\"]\n    AUI[\"UI\"]\n    ADomain[\"Domain\"]\n    AData[\"Data\"]\n    AUI --> ADomain --> AData\n  end\n\n  subgraph IOS[\"iosApp\"]\n    IUI[\"UI\"]\n    IDomain[\"Domain\"]\n    IData[\"Data\"]\n    IUI --> IDomain --> IData\n  end\n\n  subgraph Desktop[\"desktopApp\"]\n    DUI[\"UI\"]\n    DDomain[\"Domain\"]\n    DData[\"Data\"]\n    DUI --> DDomain --> DData\n  end\n\n  classDef layer fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  class AUI,ADomain,AData,IUI,IDomain,IData,DUI,DDomain,DData layer;\n```\n\n",
    "16-three-layer-kmp-domain.md": "# 16. Three Layer KMP Domain\n\nThe domain layer is shared. UI and data stay platform-specific.\n\n```mermaid\nflowchart LR\n  SharedDomain[\"sharedDomain\\nKMP library\\nuse cases + entities\"]\n\n  AndroidUI[\"androidApp\\nAndroid UI\"]\n  IOSUI[\"iosApp\\nSwiftUI\"]\n  DesktopUI[\"desktopApp\\nDesktop UI\"]\n\n  AndroidData[\"Android data\"]\n  IOSData[\"iOS data\"]\n  DesktopData[\"Desktop data\"]\n\n  AndroidUI --> SharedDomain\n  IOSUI --> SharedDomain\n  DesktopUI --> SharedDomain\n\n  SharedDomain -. \"repository contract\" .-> AndroidData\n  SharedDomain -. \"repository contract\" .-> IOSData\n  SharedDomain -. \"repository contract\" .-> DesktopData\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class AndroidUI,IOSUI,DesktopUI,AndroidData,IOSData,DesktopData app;\n  class SharedDomain shared;\n```\n\n",
    "17-three-layer-kmp-domain-simple.md": "# 17. Three Layer KMP Domain Simple\n\nSimplified domain-sharing view. The app modules depend on one shared domain KMP module.\n\n```mermaid\nflowchart LR\n  Android[\"androidApp\"]\n  IOS[\"iosApp\"]\n  Desktop[\"desktopApp\"]\n  SharedDomain[\"sharedDomain\\nKMP library\"]\n\n  Android --> SharedDomain\n  IOS --> SharedDomain\n  Desktop --> SharedDomain\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop app;\n  class SharedDomain shared;\n```\n\n",
    "18-three-layer-kmp-domain-data.md": "# 18. Three Layer KMP Domain And Data\n\nDomain and data are shared. Platform app modules own the UI.\n\n```mermaid\nflowchart LR\n  SharedDomain[\"sharedDomain\\nKMP library\\nuse cases + entities\"]\n  SharedData[\"sharedData\\nKMP library\\nrepositories + data sources\"]\n  SharedDomain --> SharedData\n\n  Android[\"androidApp\\nAndroid UI\"]\n  IOS[\"iosApp\\nSwiftUI\"]\n  Desktop[\"desktopApp\\nDesktop UI\"]\n\n  Android --> SharedDomain\n  IOS --> SharedDomain\n  Desktop --> SharedDomain\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop app;\n  class SharedDomain,SharedData shared;\n```\n\n",
    "19-three-layer-kmp-domain-presentation.md": "# 19. Three Layer KMP Domain And Presentation\n\nDomain and presentation are shared. Data remains platform-specific.\n\n```mermaid\nflowchart LR\n  SharedPresentation[\"sharedPresentation\\nKMP library\\nstate + actions\"]\n  SharedDomain[\"sharedDomain\\nKMP library\\nuse cases + entities\"]\n  SharedPresentation --> SharedDomain\n\n  Android[\"androidApp\\nAndroid UI\"]\n  IOS[\"iosApp\\nSwiftUI\"]\n  Desktop[\"desktopApp\\nDesktop UI\"]\n\n  AndroidData[\"Android data\"]\n  IOSData[\"iOS data\"]\n  DesktopData[\"Desktop data\"]\n\n  Android --> SharedPresentation\n  IOS --> SharedPresentation\n  Desktop --> SharedPresentation\n\n  SharedDomain -. \"repository contract\" .-> AndroidData\n  SharedDomain -. \"repository contract\" .-> IOSData\n  SharedDomain -. \"repository contract\" .-> DesktopData\n\n  classDef app fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;\n  classDef shared fill:#fff0b8,stroke:#9b7415,color:#3b2a00,stroke-width:2px;\n  class Android,IOS,Desktop,AndroidData,IOSData,DesktopData app;\n  class SharedPresentation,SharedDomain shared;\n```\n\n"
  }
};
