package com.example.kmpsamples.threelayernative.desktop.data

class TaskRepository(
    private val dataSource: TaskDataSource
) {
    fun loadTaskTitle(platform: String): String = dataSource.loadTask(platform)
}
