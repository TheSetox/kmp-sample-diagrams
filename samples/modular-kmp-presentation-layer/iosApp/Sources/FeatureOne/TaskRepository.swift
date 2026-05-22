final class TaskRepository {
    private let dataSource: TaskDataSource

    init(dataSource: TaskDataSource) {
        self.dataSource = dataSource
    }

    func loadTaskSummary(platform: String) -> String {
        dataSource.loadTask(platform: platform)
    }
}
