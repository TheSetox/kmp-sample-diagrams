package com.example.kmpsamples.threelayerkmpdomain.desktop

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.threelayerkmpdomain.shareddomain.SampleMessage

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Three Layer KMP Domain") {
        MaterialTheme {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("Three Layer KMP Domain")
                Text(sampleDetail())
            }
        }
    }
}

private fun sampleDetail(): String = SampleMessage().message("Desktop")
