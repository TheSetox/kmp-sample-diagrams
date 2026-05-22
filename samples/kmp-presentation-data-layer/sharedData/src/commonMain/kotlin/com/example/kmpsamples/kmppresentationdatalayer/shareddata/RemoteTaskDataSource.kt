package com.example.kmpsamples.kmppresentationdatalayer.shareddata

class RemoteTaskDataSource {
    fun loadTask(platform: String): String = "remote task for $platform"
}
