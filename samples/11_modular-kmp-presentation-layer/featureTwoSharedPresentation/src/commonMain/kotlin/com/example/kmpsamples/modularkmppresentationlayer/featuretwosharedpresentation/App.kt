package com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun App(
    platform: String,
    repository: DetailsRepository,
    modifier: Modifier = Modifier
) {
    DetailsScreen(
        platform = platform,
        repository = repository,
        modifier = modifier
    )
}
