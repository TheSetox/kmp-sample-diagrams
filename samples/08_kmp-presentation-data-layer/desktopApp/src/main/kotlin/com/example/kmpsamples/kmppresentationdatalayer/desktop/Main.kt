package com.example.kmpsamples.kmppresentationdatalayer.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.kmppresentationdatalayer.shareddata.TaskRepository
import com.example.kmpsamples.kmppresentationdatalayer.sharedpresentation.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "KMP Presentation And Data Layers") {
        App(platform = "Desktop", repository = TaskRepository())
    }
}
