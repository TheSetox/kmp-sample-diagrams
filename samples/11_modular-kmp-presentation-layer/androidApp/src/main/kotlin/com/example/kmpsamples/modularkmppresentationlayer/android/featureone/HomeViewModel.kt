package com.example.kmpsamples.modularkmppresentationlayer.android.featureone

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = "Native Feature One HomeViewModel -> " + repository.loadTaskSummary(platform)
}
