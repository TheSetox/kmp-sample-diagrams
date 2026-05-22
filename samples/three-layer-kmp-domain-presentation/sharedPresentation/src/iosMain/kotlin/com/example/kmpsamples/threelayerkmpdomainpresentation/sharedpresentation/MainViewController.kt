package com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation

import androidx.compose.ui.window.ComposeUIViewController
import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.TaskRepository

fun MainViewController(
    platform: String,
    repository: TaskRepository
) = ComposeUIViewController {
    App(platform = platform, repository = repository)
}
