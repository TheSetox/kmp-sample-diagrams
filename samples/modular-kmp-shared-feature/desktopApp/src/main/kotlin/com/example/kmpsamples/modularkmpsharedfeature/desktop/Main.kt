package com.example.kmpsamples.modularkmpsharedfeature.desktop

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpsharedfeature.desktop.featureone.FeatureOneScreen
import com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP Shared Feature") {
        MaterialTheme {
            Surface(modifier = Modifier.fillMaxSize()) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("Modular KMP Shared Feature")
                    FeatureOneScreen(platform = "Desktop")
                    App(
                        platform = "Desktop",
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}
