package com.example.kmpsamples.modularkmppresentationlayer.desktop

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
import com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP Presentation Layer") {
        MaterialTheme {
            Surface(modifier = Modifier.fillMaxSize()) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("Modular KMP Presentation Layer")
                    Text("Feature One (native Desktop)")
                    Text(HomeViewModel().screenState("Desktop"))
                    App(
                        platform = "Desktop",
                        repository = DetailsRepository(DetailsDataSource()),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}
