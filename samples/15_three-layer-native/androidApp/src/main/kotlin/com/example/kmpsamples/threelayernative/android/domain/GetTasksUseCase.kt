package com.example.kmpsamples.threelayernative.android.domain

import com.example.kmpsamples.threelayernative.android.data.TaskRepository

class GetTasksUseCase(
    private val repository: TaskRepository
) {
    fun loadTaskSummary(platform: String): String {
        val task = Task(repository.loadTaskTitle(platform))
        return "Android domain mapped ${task.title}"
    }
}
