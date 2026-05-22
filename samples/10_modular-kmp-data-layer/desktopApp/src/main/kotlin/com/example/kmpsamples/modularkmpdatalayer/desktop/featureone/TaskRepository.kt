package com.example.kmpsamples.modularkmpdatalayer.desktop.featureone

class TaskRepository(
    private val dataSource: TaskDataSource
) {
    fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
