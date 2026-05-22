package com.example.kmpsamples.threelayerkmpdomain.android

import com.example.kmpsamples.threelayerkmpdomain.shareddomain.Task
import com.example.kmpsamples.threelayerkmpdomain.shareddomain.TaskRepository as SharedTaskRepository

class TaskRepository(
    private val dataSource: TaskDataSource
) : SharedTaskRepository {
    override fun loadTask(platform: String): Task = Task(
        title = "Android repository task",
        details = dataSource.loadTask(platform)
    )
}
