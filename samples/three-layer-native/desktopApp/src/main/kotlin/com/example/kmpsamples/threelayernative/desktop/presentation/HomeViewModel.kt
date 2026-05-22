package com.example.kmpsamples.threelayernative.desktop.presentation

import com.example.kmpsamples.threelayernative.desktop.data.TaskDataSource
import com.example.kmpsamples.threelayernative.desktop.data.TaskRepository
import com.example.kmpsamples.threelayernative.desktop.domain.GetTasksUseCase

class HomeViewModel(
    private val useCase: GetTasksUseCase = GetTasksUseCase(TaskRepository(TaskDataSource()))
) {
    fun screenState(platform: String): String = useCase.loadTaskSummary(platform)
}
