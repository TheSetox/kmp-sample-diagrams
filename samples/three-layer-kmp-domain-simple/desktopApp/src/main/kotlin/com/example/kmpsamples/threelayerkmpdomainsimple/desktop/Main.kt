package com.example.kmpsamples.threelayerkmpdomainsimple.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "threelayerkmpdomainsimple"
    ) {
        HomeWindow()
    }
}
