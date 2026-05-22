package com.example.kmpsamples.kmpcomposeui.shared

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController(
    state: HomeUiState,
    onRefresh: () -> Unit
) = ComposeUIViewController {
    App(state = state, onRefresh = onRefresh)
}
