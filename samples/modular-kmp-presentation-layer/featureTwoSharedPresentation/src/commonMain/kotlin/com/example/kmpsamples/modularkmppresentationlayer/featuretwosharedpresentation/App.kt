package com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class DetailsUiState(
    val title: String,
    val body: String
)

interface DetailsRepository {
    fun loadDetailsSummary(platform: String): String
}

class DetailsViewModel(
    private val repository: DetailsRepository
) {
    fun load(platform: String): DetailsUiState = DetailsUiState(
        title = "Shared DetailsViewModel on $platform",
        body = repository.loadDetailsSummary(platform)
    )

    fun refresh(platform: String): DetailsUiState = DetailsUiState(
        title = "Shared DetailsViewModel refreshed on $platform",
        body = repository.loadDetailsSummary(platform)
    )
}

@Composable
fun App(
    platform: String,
    repository: DetailsRepository,
    modifier: Modifier = Modifier
) {
    val viewModel = remember { DetailsViewModel(repository) }
    var state by remember { mutableStateOf(viewModel.load(platform)) }
    MaterialTheme {
        Surface(modifier = modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Modular KMP Presentation Layer")
                Text(state.title)
                Text(state.body)
                Button(onClick = { state = viewModel.refresh(platform) }) {
                    Text("Refresh")
                }
            }
        }
    }
}
