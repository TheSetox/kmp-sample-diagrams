package com.example.kmpsamples.modularnative.desktop

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular Native") {
        MaterialTheme {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("Modular Native")
                Text(sampleDetail())
            }
        }
    }
}

private fun sampleDetail(): String = "Modular Native on Desktop\nNo shared KMP module in this baseline."
