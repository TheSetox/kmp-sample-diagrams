final class DetailsViewModel {
    private let repository: DetailsRepository

    init(repository: DetailsRepository = DetailsRepository(dataSource: DetailsDataSource())) {
        self.repository = repository
    }

    func screenState(platform: String) -> String {
        repository.loadDetailsSummary(platform: platform)
    }
}
