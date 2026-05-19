package com.example.kmpsamples.kmpcomposeui.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.kmpcomposeui.shared.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "KMP Compose UI") {
        App(platform = "Desktop", detail = sampleDetail())
    }
}

private fun sampleDetail(): String = "KMP Compose UI on Desktop\nNo shared KMP module in this baseline."
