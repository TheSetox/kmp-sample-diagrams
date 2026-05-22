final class GetTasksUseCase {
    private let repository: TaskRepository

    init(repository: TaskRepository) {
        self.repository = repository
    }

    func loadTaskSummary(platform: String) -> String {
        let task = Task(title: repository.loadTaskTitle(platform: platform))
        return "iOS domain mapped \(task.title)"
    }
}
