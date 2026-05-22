package com.example.kmpsamples.kmppresentationlayer.android

class TaskRepository(
    private val dataSource: TaskDataSource
) : com.example.kmpsamples.kmppresentationlayer.sharedpresentation.TaskRepository {
    override fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
