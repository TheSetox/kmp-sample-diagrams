package com.example.kmpsamples.modularkmpuidatalayer.desktop

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpuidatalayer.desktop.featureone.FeatureOneScreen
import com.example.kmpsamples.modularkmpuidatalayer.featuretwosharedui.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP UI And Data Layers") {
        val detailsViewModel = remember { DetailsViewModel() }
        var state by remember { mutableStateOf(detailsViewModel.load("Desktop")) }
        MaterialTheme {
            Surface(modifier = Modifier.fillMaxSize()) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("Modular KMP UI And Data Layers")
                    FeatureOneScreen(platform = "Desktop")
                    App(
                        state = state,
                        onRefresh = { state = detailsViewModel.refresh("Desktop") },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}
