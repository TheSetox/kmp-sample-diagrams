final class HomeViewModel {
    private let repository = TaskRepository(dataSource: TaskDataSource())

    func screenState(platform: String) -> String {
        repository.loadTaskSummary(platform: platform)
    }
}
