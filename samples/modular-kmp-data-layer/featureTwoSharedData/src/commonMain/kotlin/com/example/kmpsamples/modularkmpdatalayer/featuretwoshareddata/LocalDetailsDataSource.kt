package com.example.kmpsamples.modularkmpdatalayer.featuretwoshareddata

class LocalDetailsDataSource {
    fun loadDetails(platform: String): String = "cached details for $platform"
}
