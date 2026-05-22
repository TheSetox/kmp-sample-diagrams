import SharedPresentation

final class IosTaskRepository: TaskRepository {
    private let dataSource: TaskDataSource

    init(dataSource: TaskDataSource) {
        self.dataSource = dataSource
    }

    func loadTask(platform: String) -> Task {
        Task(
            title: "iOS repository task",
            details: dataSource.loadTask(platform: platform)
        )
    }
}
