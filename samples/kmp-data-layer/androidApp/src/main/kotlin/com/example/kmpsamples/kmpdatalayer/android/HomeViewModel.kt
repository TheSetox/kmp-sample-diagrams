package com.example.kmpsamples.kmpdatalayer.android

import com.example.kmpsamples.kmpdatalayer.shareddata.TaskRepository

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository()
) {
    fun screenState(platform: String): String = "Native ViewModel -> ${repository.loadTaskSummary(platform)}"
}
