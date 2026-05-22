package com.example.kmpsamples.kmpdatalayer.shareddata

class TaskRepository(
    private val remote: RemoteTaskDataSource = RemoteTaskDataSource(),
    private val cache: LocalTaskDataSource = LocalTaskDataSource(),
    private val mapper: TaskDtoMapper = TaskDtoMapper()
) {
    fun loadTaskSummary(platform: String): String {
        val remoteValue = mapper.map(remote.loadTask(platform))
        val cachedValue = mapper.map(cache.loadTask(platform))
        return "TaskRepository merged $remoteValue and $cachedValue"
    }
}
