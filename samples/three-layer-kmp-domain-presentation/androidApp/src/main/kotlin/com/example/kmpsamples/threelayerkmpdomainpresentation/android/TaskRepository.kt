package com.example.kmpsamples.threelayerkmpdomainpresentation.android

import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.Task
import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.TaskRepository as SharedTaskRepository

class TaskRepository(
    private val dataSource: TaskDataSource
) : SharedTaskRepository {
    override fun loadTask(platform: String): Task = Task(
        title = "Android repository task",
        details = dataSource.loadTask(platform)
    )
}
