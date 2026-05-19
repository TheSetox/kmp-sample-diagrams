package com.example.kmpsamples.modularkmpsharedfeature.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP Shared Feature") {
        App(platform = "Desktop", detail = sampleDetail())
    }
}

private fun sampleDetail(): String = "Modular KMP Shared Feature on Desktop\nNo shared KMP module in this baseline."
