package com.example.kmpsamples.modularkmpuidatalayer.android.featureone

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun FeatureOneScreen(platform: String, modifier: Modifier = Modifier) {
    val viewModel = remember { HomeViewModel() }
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text("Feature One (native $platform)")
        Text(viewModel.screenState(platform))
    }
}
