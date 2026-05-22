package com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain

interface TaskRepository {
    fun loadTask(platform: String): Task
}
