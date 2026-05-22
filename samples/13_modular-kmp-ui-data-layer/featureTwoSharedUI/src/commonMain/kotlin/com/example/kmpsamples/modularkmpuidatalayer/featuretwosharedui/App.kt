package com.example.kmpsamples.modularkmpuidatalayer.featuretwosharedui

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun App(
    state: DetailsUiState,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier
) {
    DetailsScreen(
        state = state,
        onRefresh = onRefresh,
        modifier = modifier
    )
}
