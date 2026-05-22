package com.example.kmpsamples.kmppresentationlayer.sharedpresentation

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

data class HomeUiState(
    val title: String,
    val body: String
)

interface TaskRepository {
    fun loadTaskSummary(platform: String): String
}

class HomeViewModel(
    private val repository: TaskRepository
) {
    fun load(platform: String): HomeUiState = HomeUiState(
        title = "Shared HomeViewModel on $platform",
        body = repository.loadTaskSummary(platform)
    )

    fun refresh(platform: String): HomeUiState = HomeUiState(
        title = "Shared HomeViewModel refreshed on $platform",
        body = repository.loadTaskSummary(platform)
    )
}

@Composable
fun App(
    platform: String,
    repository: TaskRepository,
    modifier: Modifier = Modifier
) {
    val viewModel = remember { HomeViewModel(repository) }
    var state by remember { mutableStateOf(viewModel.load(platform)) }
    MaterialTheme {
        Surface(modifier = modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("KMP Presentation Layer")
                Text(state.title)
                Text(state.body)
                Button(onClick = { state = viewModel.refresh(platform) }) {
                    Text("Refresh")
                }
            }
        }
    }
}
