package com.example.kmpsamples.modularkmppresentationlayer.desktop

class TaskRepository(
    private val dataSource: TaskDataSource
) {
    fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
