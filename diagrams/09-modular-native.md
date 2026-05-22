# 09. Modular Native

Baseline modular architecture. Each app target owns native feature modules; each feature keeps its presentation and data code inside the platform app.

```mermaid
flowchart TB
  subgraph Desktop["desktopApp"]
    direction TB
    subgraph DF1["feature-one module"]
      direction TB
      DF1UI["HomeWindow.kt"]
      DF1VM["HomeViewModel.kt"]
      DF1Repo["TaskRepository.kt"]
      DF1Source["TaskDataSource.kt"]
      DF1UI --> DF1VM --> DF1Repo --> DF1Source
    end
    subgraph DF2["feature-two module"]
      direction TB
      DF2UI["DetailsWindow.kt"]
      DF2VM["DetailsViewModel.kt"]
      DF2Repo["DetailsRepository.kt"]
      DF2Source["DetailsDataSource.kt"]
      DF2UI --> DF2VM --> DF2Repo --> DF2Source
    end
  end

  subgraph IOS["iosApp"]
    direction TB
    subgraph IF1["feature-one module"]
      direction TB
      IF1UI["HomeView.swift"]
      IF1VM["HomeViewModel.swift"]
      IF1Repo["TaskRepository.swift"]
      IF1Source["TaskDataSource.swift"]
      IF1UI --> IF1VM --> IF1Repo --> IF1Source
    end
    subgraph IF2["feature-two module"]
      direction TB
      IF2UI["DetailsView.swift"]
      IF2VM["DetailsViewModel.swift"]
      IF2Repo["DetailsRepository.swift"]
      IF2Source["DetailsDataSource.swift"]
      IF2UI --> IF2VM --> IF2Repo --> IF2Source
    end
  end

  subgraph Android["androidApp"]
    direction TB
    subgraph AF1["feature-one module"]
      direction TB
      AF1UI["HomeScreen.kt"]
      AF1VM["HomeViewModel.kt"]
      AF1Repo["TaskRepository.kt"]
      AF1Source["TaskDataSource.kt"]
      AF1UI --> AF1VM --> AF1Repo --> AF1Source
    end
    subgraph AF2["feature-two module"]
      direction TB
      AF2UI["DetailsScreen.kt"]
      AF2VM["DetailsViewModel.kt"]
      AF2Repo["DetailsRepository.kt"]
      AF2Source["DetailsDataSource.kt"]
      AF2UI --> AF2VM --> AF2Repo --> AF2Source
    end
  end

  classDef native fill:#d8ecff,stroke:#1f5f8b,color:#0f2738,stroke-width:2px;
  class AF1UI,AF1VM,AF1Repo,AF1Source,AF2UI,AF2VM,AF2Repo,AF2Source,IF1UI,IF1VM,IF1Repo,IF1Source,IF2UI,IF2VM,IF2Repo,IF2Source,DF1UI,DF1VM,DF1Repo,DF1Source,DF2UI,DF2VM,DF2Repo,DF2Source native;
  style Android fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style IOS fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
  style Desktop fill:#edf7ff,stroke:#1f5f8b,stroke-width:2px
```
