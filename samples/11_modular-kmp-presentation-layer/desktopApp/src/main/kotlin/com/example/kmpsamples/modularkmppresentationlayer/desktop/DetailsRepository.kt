package com.example.kmpsamples.modularkmppresentationlayer.desktop

class DetailsRepository(
    private val dataSource: DetailsDataSource
) : com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation.DetailsRepository {
    override fun loadDetailsSummary(platform: String): String = dataSource.loadDetails(platform)
}
