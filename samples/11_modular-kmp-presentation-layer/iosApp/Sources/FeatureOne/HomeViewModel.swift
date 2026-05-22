final class HomeViewModel {
    private let repository = TaskRepository(dataSource: TaskDataSource())

    func screenState(platform: String) -> String {
        "Native Feature One HomeViewModel -> \(repository.loadTaskSummary(platform: platform))"
    }
}
