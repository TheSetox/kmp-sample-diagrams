package com.example.kmpsamples.threelayerkmpdomainsimple.desktop

import com.example.kmpsamples.threelayerkmpdomainsimple.shareddomain.Task
import com.example.kmpsamples.threelayerkmpdomainsimple.shareddomain.TaskRepository as SharedTaskRepository

class TaskRepository(
    private val dataSource: TaskDataSource
) : SharedTaskRepository {
    override fun loadTask(platform: String): Task = Task(
        title = "Desktop repository task",
        details = dataSource.loadTask(platform)
    )
}
