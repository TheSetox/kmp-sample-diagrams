package com.example.kmpsamples.layerednative.desktop.presentation

import com.example.kmpsamples.layerednative.desktop.data.TaskDataSource
import com.example.kmpsamples.layerednative.desktop.data.TaskRepository

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun screenState(platform: String): String = repository.loadTaskSummary(platform)
}
