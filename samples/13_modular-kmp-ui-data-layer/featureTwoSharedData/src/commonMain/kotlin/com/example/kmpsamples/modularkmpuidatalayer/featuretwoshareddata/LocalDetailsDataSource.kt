package com.example.kmpsamples.modularkmpuidatalayer.featuretwoshareddata

class LocalDetailsDataSource {
    fun loadDetails(platform: String): String = "cached details for $platform"
}
