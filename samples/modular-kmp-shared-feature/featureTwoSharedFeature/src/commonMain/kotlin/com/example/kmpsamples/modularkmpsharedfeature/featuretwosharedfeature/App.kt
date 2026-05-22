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

data class DetailsUiState(
    val title: String,
    val body: String,
    val nativeFeatureOneSummary: String
)

class DetailsViewModel(
    private val repository: DetailsRepository = DetailsRepository(DetailsDataSource())
) {
    fun load(platform: String, nativeFeatureOneSummary: String): DetailsUiState = DetailsUiState(
        title = "Shared feature DetailsViewModel on $platform",
        body = repository.loadDetailsSummary(platform),
        nativeFeatureOneSummary = nativeFeatureOneSummary
    )

    fun refresh(platform: String, nativeFeatureOneSummary: String): DetailsUiState = DetailsUiState(
        title = "Shared feature DetailsViewModel refreshed on $platform",
        body = repository.loadDetailsSummary(platform),
        nativeFeatureOneSummary = nativeFeatureOneSummary
    )
}

class DetailsRepository(
    private val dataSource: DetailsDataSource
) {
    fun loadDetailsSummary(platform: String): String = dataSource.loadDetails(platform)
}

class DetailsDataSource {
    fun loadDetails(platform: String): String = "Feature two shared KMP data source loaded details for $platform."
}

@Composable
fun App(
    platform: String,
    nativeFeatureOneSummary: String,
    modifier: Modifier = Modifier
) {
    val viewModel = remember { DetailsViewModel() }
    var state by remember { mutableStateOf(viewModel.load(platform, nativeFeatureOneSummary)) }
    MaterialTheme {
        Surface(modifier = modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Modular KMP Shared Feature")
                Text(state.nativeFeatureOneSummary)
                Text(state.title)
                Text(state.body)
                Button(onClick = { state = viewModel.refresh(platform, nativeFeatureOneSummary) }) {
                    Text("Refresh")
                }
            }
        }
    }
}
