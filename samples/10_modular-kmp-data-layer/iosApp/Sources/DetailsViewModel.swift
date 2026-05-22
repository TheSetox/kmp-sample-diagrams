import FeatureTwoSharedData

final class DetailsViewModel {
    private let repository = DetailsRepository()

    func screenState(platform: String) -> String {
        "Native DetailsViewModel -> \(repository.loadDetailsSummary(platform: platform))"
    }
}
