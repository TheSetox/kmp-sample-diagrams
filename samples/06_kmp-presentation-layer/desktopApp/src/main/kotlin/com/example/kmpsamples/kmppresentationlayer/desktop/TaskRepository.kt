package com.example.kmpsamples.kmppresentationlayer.desktop

class TaskRepository(
    private val dataSource: TaskDataSource
) : com.example.kmpsamples.kmppresentationlayer.sharedpresentation.TaskRepository {
    override fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
