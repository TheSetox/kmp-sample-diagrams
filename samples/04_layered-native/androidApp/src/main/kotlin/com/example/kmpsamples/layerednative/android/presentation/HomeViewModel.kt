package com.example.kmpsamples.layerednative.android.presentation

import com.example.kmpsamples.layerednative.android.data.TaskDataSource
import com.example.kmpsamples.layerednative.android.data.TaskRepository

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = repository.loadTaskSummary(platform)
}
