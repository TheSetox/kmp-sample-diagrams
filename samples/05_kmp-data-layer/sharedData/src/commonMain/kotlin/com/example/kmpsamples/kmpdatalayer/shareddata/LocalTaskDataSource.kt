package com.example.kmpsamples.kmpdatalayer.shareddata

class LocalTaskDataSource {
    fun loadTask(platform: String): String = "cached task for $platform"
}
