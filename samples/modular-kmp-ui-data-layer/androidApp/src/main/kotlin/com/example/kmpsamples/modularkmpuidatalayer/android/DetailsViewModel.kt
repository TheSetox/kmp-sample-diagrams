package com.example.kmpsamples.modularkmpuidatalayer.android

import com.example.kmpsamples.modularkmpuidatalayer.featuretwoshareddata.DetailsRepository
import com.example.kmpsamples.modularkmpuidatalayer.featuretwosharedui.DetailsUiState

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository()
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
