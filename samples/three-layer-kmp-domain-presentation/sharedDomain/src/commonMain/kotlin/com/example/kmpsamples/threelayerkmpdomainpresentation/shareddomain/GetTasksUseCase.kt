package com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain

class GetTasksUseCase(
    private val repository: TaskRepository
) {
    fun execute(platform: String): Task = repository.loadTask(platform)
}
