package com.example.kmpsamples.kmpuilayer.desktop

import com.example.kmpsamples.kmpuilayer.sharedui.HomeUiState

class HomeViewModel(
    private val repository: TaskRepository = TaskRepository(TaskDataSource())
) {
    fun load(platform: String): HomeUiState = HomeUiState(
        title = "Native HomeViewModel on $platform",
        body = repository.loadTaskSummary(platform)
    )

    fun refresh(platform: String): HomeUiState = HomeUiState(
        title = "Native HomeViewModel refreshed on $platform",
        body = repository.loadTaskSummary(platform)
    )
}
