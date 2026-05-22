package com.example.kmpsamples.threelayerkmpdomaindata.shareddata

class TaskRepository(
    private val remote: RemoteTaskDataSource = RemoteTaskDataSource(),
    private val cache: LocalTaskDataSource = LocalTaskDataSource(),
    private val mapper: TaskDtoMapper = TaskDtoMapper()
) {
    fun loadTaskSummary(platform: String): String {
        val remoteValue = mapper.map(remote.loadTask(platform))
        val cachedValue = mapper.map(cache.loadTask(platform))
        return "Shared TaskRepository merged $remoteValue and $cachedValue."
    }
}
