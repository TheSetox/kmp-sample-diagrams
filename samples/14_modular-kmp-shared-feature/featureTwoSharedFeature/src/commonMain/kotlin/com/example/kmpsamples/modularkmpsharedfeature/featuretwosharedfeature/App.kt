package com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun App(
    platform: String,
    modifier: Modifier = Modifier
) {
    DetailsScreen(
        platform = platform,
        modifier = modifier
    )
}
