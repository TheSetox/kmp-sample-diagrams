import FeatureTwoSharedUI
import FeatureTwoSharedData

final class DetailsViewModel {
    private let repository = DetailsRepository()

    func load(platform: String) -> DetailsUiState {
        DetailsUiState(title: "Native DetailsViewModel on \(platform)", body: repository.loadDetailsSummary(platform: platform))
    }

    func refresh(platform: String) -> DetailsUiState {
        DetailsUiState(title: "Native DetailsViewModel refreshed on \(platform)", body: repository.loadDetailsSummary(platform: platform))
    }
}
