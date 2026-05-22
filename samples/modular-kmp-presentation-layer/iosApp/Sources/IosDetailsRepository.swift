import FeatureTwoSharedPresentation

final class IosDetailsRepository: DetailsRepository {
    private let dataSource: DetailsDataSource

    init(dataSource: DetailsDataSource) {
        self.dataSource = dataSource
    }

    func loadDetailsSummary(platform: String) -> String {
        dataSource.loadDetails(platform: platform)
    }
}
