package com.example.kmpsamples.modularkmppresentationlayer.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP Presentation Layer") {
        App(
            platform = "Desktop",
            repository = DetailsRepository(DetailsDataSource())
        )
    }
}
