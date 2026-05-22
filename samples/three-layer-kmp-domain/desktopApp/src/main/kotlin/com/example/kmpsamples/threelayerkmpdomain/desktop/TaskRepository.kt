package com.example.kmpsamples.threelayerkmpdomain.desktop

import com.example.kmpsamples.threelayerkmpdomain.shareddomain.Task
import com.example.kmpsamples.threelayerkmpdomain.shareddomain.TaskRepository as SharedTaskRepository

class TaskRepository(
    private val dataSource: TaskDataSource
) : SharedTaskRepository {
    override fun loadTask(platform: String): Task = Task(
        title = "Desktop repository task",
        details = dataSource.loadTask(platform)
    )
}
