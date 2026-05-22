import SharedData

final class HomeViewModel {
    private let repository = TaskRepository()

    func screenState(platform: String) -> String {
        "Native ViewModel -> \(repository.loadTaskSummary(platform: platform))"
    }
}
