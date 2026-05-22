package com.example.kmpsamples.threelayerkmpdomainpresentation.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation.App

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "three-layer-kmp-domain-presentation"
    ) {
        App(
            platform = "Desktop",
            repository = TaskRepository(TaskDataSource())
        )
    }
}
