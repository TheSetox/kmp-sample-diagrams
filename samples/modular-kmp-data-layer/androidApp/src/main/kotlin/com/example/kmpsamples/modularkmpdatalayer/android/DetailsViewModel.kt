package com.example.kmpsamples.modularkmpdatalayer.android

import com.example.kmpsamples.modularkmpdatalayer.featuretwoshareddata.DetailsRepository

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository()
) {
    fun screenState(platform: String): String = "Native DetailsViewModel -> ${repository.loadDetailsSummary(platform)}"
}
