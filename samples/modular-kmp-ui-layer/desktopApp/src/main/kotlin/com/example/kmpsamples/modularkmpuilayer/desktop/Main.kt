package com.example.kmpsamples.modularkmpuilayer.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpuilayer.featuretwosharedui.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP UI Layer") {
        App(platform = "Desktop", detail = sampleDetail())
    }
}

private fun sampleDetail(): String = "Modular KMP UI Layer on Desktop\nNo shared KMP module in this baseline."
