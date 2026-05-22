package com.example.kmpsamples.modularkmpuidatalayer.featuretwoshareddata

class DetailsRepository(
    private val remote: RemoteDetailsDataSource,
    private val cache: LocalDetailsDataSource,
    private val mapper: DetailsDtoMapper
) {
    constructor() : this(RemoteDetailsDataSource(), LocalDetailsDataSource(), DetailsDtoMapper())

    fun loadDetailsSummary(platform: String): String {
        val remoteValue = mapper.map(remote.loadDetails(platform))
        val cachedValue = mapper.map(cache.loadDetails(platform))
        return "DetailsRepository merged $remoteValue and $cachedValue"
    }
}
