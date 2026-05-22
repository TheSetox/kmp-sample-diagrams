package com.example.kmpsamples.kmppresentationlayer.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.kmppresentationlayer.sharedpresentation.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "KMP Presentation Layer") {
        App(
            platform = "Desktop",
            repository = TaskRepository(TaskDataSource())
        )
    }
}
