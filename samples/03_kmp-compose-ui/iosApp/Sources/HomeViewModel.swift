import Shared

final class HomeViewModel {
    private let repository: TaskRepository

    init(repository: TaskRepository = TaskRepository(dataSource: TaskDataSource())) {
        self.repository = repository
    }

    func load(platform: String) -> HomeUiState {
        HomeUiState(title: "Native HomeViewModel on \(platform)", body: repository.loadTaskSummary(platform: platform))
    }

    func refresh(platform: String) -> HomeUiState {
        HomeUiState(title: "Native HomeViewModel refreshed on \(platform)", body: repository.loadTaskSummary(platform: platform))
    }
}
