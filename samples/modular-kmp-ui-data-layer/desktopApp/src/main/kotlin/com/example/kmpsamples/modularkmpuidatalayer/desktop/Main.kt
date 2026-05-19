package com.example.kmpsamples.modularkmpuidatalayer.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpuidatalayer.featuretwosharedui.App
import com.example.kmpsamples.modularkmpuidatalayer.featuretwoshareddata.SampleMessage

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP UI And Data Layers") {
        App(platform = "Desktop", detail = sampleDetail())
    }
}

private fun sampleDetail(): String = SampleMessage().message("Desktop")
