package com.example.kmpsamples.threelayerkmpdomaindata.shareddata

class TaskRepository(
    private val remote: RemoteTaskDataSource,
    private val cache: LocalTaskDataSource,
    private val mapper: TaskDtoMapper
) {
    constructor() : this(RemoteTaskDataSource(), LocalTaskDataSource(), TaskDtoMapper())

    fun loadTaskSummary(platform: String): String {
        val remoteValue = mapper.map(remote.loadTask(platform))
        val cachedValue = mapper.map(cache.loadTask(platform))
        return "Shared TaskRepository merged $remoteValue and $cachedValue."
    }
}
