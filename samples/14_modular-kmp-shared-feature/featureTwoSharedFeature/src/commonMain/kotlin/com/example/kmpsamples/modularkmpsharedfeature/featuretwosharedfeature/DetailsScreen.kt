package com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature

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

@Composable
fun DetailsScreen(
    platform: String,
    modifier: Modifier = Modifier
) {
    val viewModel = remember { DetailsViewModel() }
    var state by remember { mutableStateOf(viewModel.load(platform)) }

    MaterialTheme {
        Surface(modifier = modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Feature Two (shared feature)")
                Text(state.title)
                Text(state.body)
                Button(onClick = { state = viewModel.refresh(platform) }) {
                    Text("Refresh")
                }
            }
        }
    }
}
