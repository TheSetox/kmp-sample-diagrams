package com.example.kmpsamples.kmpnativeui.sharedlogic

class HomeViewModel(
    private val useCase: GetTasksUseCase = GetTasksUseCase(TaskRepository(TaskDataSource()))
) {
    fun screenState(platform: String): String = useCase.loadTaskSummary(platform)
}
