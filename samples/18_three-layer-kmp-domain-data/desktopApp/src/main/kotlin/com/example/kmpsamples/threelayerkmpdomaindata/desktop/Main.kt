package com.example.kmpsamples.threelayerkmpdomaindata.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "threelayerkmpdomaindata"
    ) {
        HomeWindow()
    }
}
