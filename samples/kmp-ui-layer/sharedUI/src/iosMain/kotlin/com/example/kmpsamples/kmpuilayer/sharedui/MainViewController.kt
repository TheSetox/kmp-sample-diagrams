package com.example.kmpsamples.kmpuilayer.sharedui

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    state: HomeUiState,
    onRefresh: () -> Unit
) = ComposeUIViewController {
    App(state = state, onRefresh = onRefresh)
}
