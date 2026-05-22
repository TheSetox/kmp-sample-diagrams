package com.example.kmpsamples.threelayerkmpdomainpresentation.desktop

import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.Task
import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.TaskRepository as SharedTaskRepository

class TaskRepository(
    private val dataSource: TaskDataSource
) : SharedTaskRepository {
    override fun loadTask(platform: String): Task = Task(
        title = "Desktop repository task",
        details = dataSource.loadTask(platform)
    )
}
