package com.example.kmpsamples.kmpuilayer.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.kmpuilayer.sharedui.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "KMP UI Layer") {
        App(platform = "Desktop", detail = sampleDetail())
    }
}

private fun sampleDetail(): String = "KMP UI Layer on Desktop\nNo shared KMP module in this baseline."
