package com.example.kmpsamples.modularkmpdatalayer.featuretwoshareddata

class DetailsRepository(
    private val remote: RemoteDetailsDataSource = RemoteDetailsDataSource(),
    private val cache: LocalDetailsDataSource = LocalDetailsDataSource(),
    private val mapper: DetailsDtoMapper = DetailsDtoMapper()
) {
    fun loadDetailsSummary(platform: String): String {
        val remoteValue = mapper.map(remote.loadDetails(platform))
        val cachedValue = mapper.map(cache.loadDetails(platform))
        return "DetailsRepository merged $remoteValue and $cachedValue"
    }
}
