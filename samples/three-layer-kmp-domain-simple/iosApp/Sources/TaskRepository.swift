import SharedDomain

final class IosTaskRepository: TaskRepository {
    private let dataSource: TaskDataSource

    init(dataSource: TaskDataSource) {
        self.dataSource = dataSource
    }

    func loadTask(platform: String) -> SharedDomain.Task {
        SharedDomain.Task(
            title: "iOS repository task",
            details: dataSource.loadTask(platform: platform)
        )
    }
}
