package com.example.kmpsamples.normalnative.desktop

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Normal Native") {
        MaterialTheme {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("Normal Native")
                Text(sampleDetail())
            }
        }
    }
}

private fun sampleDetail(): String = "Normal Native on Desktop\nNo shared KMP module in this baseline."
