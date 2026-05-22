package com.example.kmpsamples.modularkmpuilayer.android

class DetailsRepository(
    private val dataSource: DetailsDataSource
) {
    fun loadDetailsSummary(platform: String): String = dataSource.loadDetails(platform)
}
