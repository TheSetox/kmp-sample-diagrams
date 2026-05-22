final class HomeViewModel {
    private let repository: TaskRepository

    init(repository: TaskRepository = TaskRepository(dataSource: TaskDataSource())) {
        self.repository = repository
    }

    func screenState(platform: String) -> String {
        repository.loadTaskSummary(platform: platform)
    }
}
