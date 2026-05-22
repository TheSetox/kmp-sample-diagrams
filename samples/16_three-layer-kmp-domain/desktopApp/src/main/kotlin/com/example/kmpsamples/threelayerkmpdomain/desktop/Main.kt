package com.example.kmpsamples.threelayerkmpdomain.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "threelayerkmpdomain"
    ) {
        HomeWindow()
    }
}
