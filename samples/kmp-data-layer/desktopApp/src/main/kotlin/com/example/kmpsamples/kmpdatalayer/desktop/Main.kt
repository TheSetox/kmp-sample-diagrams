package com.example.kmpsamples.kmpdatalayer.desktop

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.kmpdatalayer.shareddata.SampleMessage

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "KMP Data Layer") {
        MaterialTheme {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("KMP Data Layer")
                Text(sampleDetail())
            }
        }
    }
}

private fun sampleDetail(): String = SampleMessage().message("Desktop")
