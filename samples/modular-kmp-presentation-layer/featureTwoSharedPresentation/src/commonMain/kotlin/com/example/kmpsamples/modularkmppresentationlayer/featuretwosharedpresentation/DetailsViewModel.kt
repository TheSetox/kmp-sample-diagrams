package com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation

class DetailsViewModel(
    private val repository: DetailsRepository
) {
    fun load(platform: String): DetailsUiState = DetailsUiState(
        title = "Shared DetailsViewModel on $platform",
        body = repository.loadDetailsSummary(platform)
    )

    fun refresh(platform: String): DetailsUiState = DetailsUiState(
        title = "Shared DetailsViewModel refreshed on $platform",
        body = repository.loadDetailsSummary(platform)
    )
}
