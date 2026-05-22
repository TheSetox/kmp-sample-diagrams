package com.example.kmpsamples.modularkmpuidatalayer.desktop.featureone

class TaskRepository(
    private val dataSource: TaskDataSource
) {
    fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
