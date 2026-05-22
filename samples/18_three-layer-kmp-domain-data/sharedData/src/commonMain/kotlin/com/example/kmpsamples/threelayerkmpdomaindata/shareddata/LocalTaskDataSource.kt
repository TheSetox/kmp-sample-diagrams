package com.example.kmpsamples.threelayerkmpdomaindata.shareddata

class LocalTaskDataSource {
    fun loadTask(platform: String): String = "cached Details for $platform"
}
