package com.example.kmpsamples.threelayerkmpdomaindata.shareddomain

import com.example.kmpsamples.threelayerkmpdomaindata.shareddata.TaskRepository

class GetTasksUseCase(
    private val repository: TaskRepository
) {
    constructor() : this(TaskRepository())

    fun execute(platform: String): Task = Task(
        title = "Shared domain task for $platform",
        details = repository.loadTaskSummary(platform)
    )
}
