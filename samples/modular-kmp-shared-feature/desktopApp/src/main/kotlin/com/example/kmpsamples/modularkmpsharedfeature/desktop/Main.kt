package com.example.kmpsamples.modularkmpsharedfeature.desktop

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP Shared Feature") {
        App(
            platform = "Desktop",
            nativeFeatureOneSummary = HomeViewModel().screenState("Desktop")
        )
    }
}
