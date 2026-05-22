package com.example.kmpsamples.threelayerkmpdomain.shareddomain

interface TaskRepository {
    fun loadTask(platform: String): Task
}
