final class TaskRepository {
    private let dataSource: TaskDataSource

    init(dataSource: TaskDataSource) {
        self.dataSource = dataSource
    }

    func loadTaskTitle(platform: String) -> String {
        dataSource.loadTask(platform: platform)
    }
}
