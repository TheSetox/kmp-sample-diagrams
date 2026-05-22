package com.example.kmpsamples.threelayerkmpdomainsimple.desktop

import com.example.kmpsamples.threelayerkmpdomainsimple.shareddomain.GetTasksUseCase

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
