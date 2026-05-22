package com.example.kmpsamples.threelayernative.android.presentation

import com.example.kmpsamples.threelayernative.android.data.TaskDataSource
import com.example.kmpsamples.threelayernative.android.data.TaskRepository
import com.example.kmpsamples.threelayernative.android.domain.GetTasksUseCase

class HomeViewModel(
    private val useCase: GetTasksUseCase = GetTasksUseCase(TaskRepository(TaskDataSource()))
) {
    fun screenState(platform: String): String = useCase.loadTaskSummary(platform)
}
