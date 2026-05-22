package com.example.kmpsamples.kmpnativeui.sharedlogic

class GetTasksUseCase(
    private val repository: TaskRepository
) {
    fun loadTaskSummary(platform: String): String = "Shared ViewModel -> UseCase -> ${repository.loadTaskSummary(platform)}"
}
