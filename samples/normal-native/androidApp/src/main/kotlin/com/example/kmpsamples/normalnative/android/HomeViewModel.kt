package com.example.kmpsamples.normalnative.android

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = repository.loadTaskSummary(platform)
}
