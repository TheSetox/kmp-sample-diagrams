package com.example.kmpsamples.normalnative.desktop

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = repository.loadTaskSummary(platform)
}
