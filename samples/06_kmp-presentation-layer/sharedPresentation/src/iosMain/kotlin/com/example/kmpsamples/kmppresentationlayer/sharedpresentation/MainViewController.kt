package com.example.kmpsamples.kmppresentationlayer.sharedpresentation

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    platform: String,
    repository: TaskRepository
) = ComposeUIViewController {
    App(platform = platform, repository = repository)
}
