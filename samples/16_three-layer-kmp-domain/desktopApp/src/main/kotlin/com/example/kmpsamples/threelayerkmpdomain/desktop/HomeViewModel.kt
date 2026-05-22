package com.example.kmpsamples.threelayerkmpdomain.desktop

import com.example.kmpsamples.threelayerkmpdomain.shareddomain.GetTasksUseCase

class HomeViewModel(
    private val useCase: GetTasksUseCase = GetTasksUseCase(TaskRepository(TaskDataSource()))
) {
    fun screenState(platform: String): String {
        val task = useCase.execute(platform)
        return "Native HomeViewModel -> "+ task.title + "\n" + task.details
    }

    fun refresh(platform: String): String {
        val task = useCase.execute(platform)
        return "Native HomeViewModel refreshed -> "+ task.title + "\n" + task.details
    }
}
