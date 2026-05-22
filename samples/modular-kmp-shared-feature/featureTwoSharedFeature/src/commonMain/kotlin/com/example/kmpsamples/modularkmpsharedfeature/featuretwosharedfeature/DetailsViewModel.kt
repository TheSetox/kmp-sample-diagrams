package com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository(DetailsDataSource())
) {
    fun load(platform: String): DetailsUiState = DetailsUiState(
        title = "Shared feature DetailsViewModel on $platform",
        body = repository.loadDetailsSummary(platform)
    )

    fun refresh(platform: String): DetailsUiState = DetailsUiState(
        title = "Shared feature DetailsViewModel refreshed on $platform",
        body = repository.loadDetailsSummary(platform)
    )
}
