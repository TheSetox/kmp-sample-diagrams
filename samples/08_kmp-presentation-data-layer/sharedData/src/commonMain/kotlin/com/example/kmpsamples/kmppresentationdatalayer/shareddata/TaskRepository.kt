package com.example.kmpsamples.kmppresentationdatalayer.shareddata

class TaskRepository(
    private val remote: RemoteTaskDataSource,
    private val cache: LocalTaskDataSource,
    private val mapper: TaskDtoMapper
) {
    constructor() : this(RemoteTaskDataSource(), LocalTaskDataSource(), TaskDtoMapper())

    fun loadTaskSummary(platform: String): String {
        val remoteValue = mapper.map(remote.loadTask(platform))
        val cachedValue = mapper.map(cache.loadTask(platform))
        return "TaskRepository merged $remoteValue and $cachedValue"
    }
}
