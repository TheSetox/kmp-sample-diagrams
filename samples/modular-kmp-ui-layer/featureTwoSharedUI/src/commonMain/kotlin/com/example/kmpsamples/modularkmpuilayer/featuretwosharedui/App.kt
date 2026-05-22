package com.example.kmpsamples.modularkmpuilayer.featuretwosharedui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class DetailsUiState(
    val title: String,
    val body: String
)

@Composable
fun App(
    state: DetailsUiState,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier
) {
    MaterialTheme {
        Surface(modifier = modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Modular KMP UI Layer")
                Text(state.title)
                Text(state.body)
                Button(onClick = onRefresh) {
                    Text("Refresh")
                }
            }
        }
    }
}
