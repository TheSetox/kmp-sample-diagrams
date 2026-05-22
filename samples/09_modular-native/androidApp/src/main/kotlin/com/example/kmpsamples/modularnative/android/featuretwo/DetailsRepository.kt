package com.example.kmpsamples.modularnative.android.featuretwo

class DetailsRepository(
    private val dataSource: DetailsDataSource
) {
    fun loadDetailsSummary(platform: String): String = dataSource.loadDetails(platform)
}
