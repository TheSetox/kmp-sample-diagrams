import SharedDomain

final class HomeViewModel {
    private let useCase: GetTasksUseCase

    init(useCase: GetTasksUseCase = GetTasksUseCase(repository: IosTaskRepository(dataSource: TaskDataSource()))) {
        self.useCase = useCase
    }

    func screenState(platform: String) -> String {
        let task = useCase.execute(platform: platform)
        return "Native HomeViewModel -> \(task.title)\n\(task.details)"
    }

    func refresh(platform: String) -> String {
        let task = useCase.execute(platform: platform)
        return "Native HomeViewModel refreshed -> \(task.title)\n\(task.details)"
    }
}
