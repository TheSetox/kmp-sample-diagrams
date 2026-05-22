final class HomeViewModel {
    private let useCase: GetTasksUseCase

    init(useCase: GetTasksUseCase = GetTasksUseCase(repository: TaskRepository(dataSource: TaskDataSource()))) {
        self.useCase = useCase
    }

    func screenState(platform: String) -> String {
        useCase.loadTaskSummary(platform: platform)
    }
}
