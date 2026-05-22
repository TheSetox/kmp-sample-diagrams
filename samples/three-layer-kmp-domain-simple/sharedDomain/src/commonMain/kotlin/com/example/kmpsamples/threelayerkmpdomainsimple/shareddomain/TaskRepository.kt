package com.example.kmpsamples.threelayerkmpdomainsimple.shareddomain

interface TaskRepository {
    fun loadTask(platform: String): Task
}
