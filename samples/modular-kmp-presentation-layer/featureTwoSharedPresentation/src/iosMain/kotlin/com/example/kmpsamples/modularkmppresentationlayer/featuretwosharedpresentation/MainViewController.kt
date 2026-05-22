package com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    platform: String,
    repository: DetailsRepository
) = ComposeUIViewController {
    App(platform = platform, repository = repository)
}
