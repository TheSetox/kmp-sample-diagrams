package com.example.kmpsamples.modularnative.android.featureone

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = repository.loadTaskSummary(platform)
}
