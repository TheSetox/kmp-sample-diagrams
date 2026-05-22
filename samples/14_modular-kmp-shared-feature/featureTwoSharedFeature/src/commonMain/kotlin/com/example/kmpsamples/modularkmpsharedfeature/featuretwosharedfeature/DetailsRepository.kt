package com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature

class DetailsRepository(
    private val dataSource: DetailsDataSource
) {
    fun loadDetailsSummary(platform: String): String = dataSource.loadDetails(platform)
}
