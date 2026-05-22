package com.example.kmpsamples.kmpcomposeui.android

import com.example.kmpsamples.kmpcomposeui.shared.HomeUiState

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
