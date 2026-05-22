package com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation

import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.GetTasksUseCase
import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.TaskRepository

class HomeViewModel(
    repository: TaskRepository
) {
    private val useCase = GetTasksUseCase(repository)

    fun load(platform: String): HomeUiState {
        val task = useCase.execute(platform)
        return HomeUiState(
            title = "Shared presentation HomeViewModel on $platform",
            body = task.title + "\n" + task.details
        )
    }

    fun refresh(platform: String): HomeUiState {
        val task = useCase.execute(platform)
        return HomeUiState(
            title = "Shared presentation HomeViewModel refreshed on $platform",
            body = task.title + "\n" + task.details
        )
    }
}
