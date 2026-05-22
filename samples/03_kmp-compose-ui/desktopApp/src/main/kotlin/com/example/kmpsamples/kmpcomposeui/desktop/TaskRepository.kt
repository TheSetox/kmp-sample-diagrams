package com.example.kmpsamples.kmpcomposeui.desktop

class TaskRepository(
    private val dataSource: TaskDataSource
) {
    fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
