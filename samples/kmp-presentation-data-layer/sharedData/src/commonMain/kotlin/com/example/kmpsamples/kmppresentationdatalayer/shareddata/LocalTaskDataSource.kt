package com.example.kmpsamples.kmppresentationdatalayer.shareddata

class LocalTaskDataSource {
    fun loadTask(platform: String): String = "cached task for $platform"
}
