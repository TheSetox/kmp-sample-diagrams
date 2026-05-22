package com.example.kmpsamples.modularkmpuilayer.android

import com.example.kmpsamples.modularkmpuilayer.featuretwosharedui.DetailsUiState

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository(DetailsDataSource())
) {
    fun load(platform: String): DetailsUiState = DetailsUiState(
        title = "Native DetailsViewModel on $platform",
        body = repository.loadDetailsSummary(platform)
    )

    fun refresh(platform: String): DetailsUiState = DetailsUiState(
        title = "Native DetailsViewModel refreshed on $platform",
        body = repository.loadDetailsSummary(platform)
    )
}
