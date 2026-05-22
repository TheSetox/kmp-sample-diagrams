package com.example.kmpsamples.modularkmpdatalayer.desktop

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = "Native Feature One HomeViewModel -> " + repository.loadTaskSummary(platform)
}
