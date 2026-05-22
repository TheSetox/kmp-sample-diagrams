package com.example.kmpsamples.modularkmpuilayer.android.featureone

class TaskRepository(
    private val dataSource: TaskDataSource
) {
    fun loadTaskSummary(platform: String): String = dataSource.loadTask(platform)
}
