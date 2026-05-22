package com.example.kmpsamples.modularkmpuidatalayer.featuretwosharedui

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    state: DetailsUiState,
    onRefresh: () -> Unit
) = ComposeUIViewController {
    App(state = state, onRefresh = onRefresh)
}
