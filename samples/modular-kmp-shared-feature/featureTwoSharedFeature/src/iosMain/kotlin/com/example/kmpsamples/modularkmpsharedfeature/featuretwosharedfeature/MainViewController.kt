package com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    platform: String,
    nativeFeatureOneSummary: String
) = ComposeUIViewController {
    App(platform = platform, nativeFeatureOneSummary = nativeFeatureOneSummary)
}
