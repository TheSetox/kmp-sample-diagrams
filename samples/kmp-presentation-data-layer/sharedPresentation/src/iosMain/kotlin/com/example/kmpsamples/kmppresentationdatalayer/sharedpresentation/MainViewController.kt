package com.example.kmpsamples.kmppresentationdatalayer.sharedpresentation

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    platform: String,
    repository: com.example.kmpsamples.kmppresentationdatalayer.shareddata.TaskRepository
) = ComposeUIViewController {
    App(platform = platform, repository = repository)
}
