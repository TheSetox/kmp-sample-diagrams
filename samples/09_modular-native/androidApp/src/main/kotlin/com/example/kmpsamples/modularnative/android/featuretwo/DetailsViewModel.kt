package com.example.kmpsamples.modularnative.android.featuretwo

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository(DetailsDataSource())
) {
    fun screenState(platform: String): String = repository.loadDetailsSummary(platform)
}
