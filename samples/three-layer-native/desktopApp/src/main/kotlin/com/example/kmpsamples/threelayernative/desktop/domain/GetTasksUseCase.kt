package com.example.kmpsamples.threelayernative.desktop.domain

import com.example.kmpsamples.threelayernative.desktop.data.TaskRepository

class GetTasksUseCase(
    private val repository: TaskRepository
) {
    fun loadTaskSummary(platform: String): String {
        val task = Task(repository.loadTaskTitle(platform))
        return "Desktop domain mapped ${task.title}"
    }
}
