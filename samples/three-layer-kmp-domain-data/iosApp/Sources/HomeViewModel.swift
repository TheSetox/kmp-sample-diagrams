import SharedDomain

final class HomeViewModel {
    private let useCase = GetTasksUseCase()

    func screenState(platform: String) -> String {
        let task = useCase.execute(platform: platform)
        return "Native HomeViewModel -> \(task.title)\n\(task.details)"
    }

    func refresh(platform: String) -> String {
        let task = useCase.execute(platform: platform)
        return "Native HomeViewModel refreshed -> \(task.title)\n\(task.details)"
    }
}
