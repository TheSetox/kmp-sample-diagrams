package com.example.kmpsamples.modularnative.desktop.featuretwo

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository(DetailsDataSource())
) {
    fun screenState(platform: String): String = repository.loadDetailsSummary(platform)
}
