package com.example.kmpsamples.modularkmpuilayer.desktop

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.modularkmpuilayer.featuretwosharedui.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Modular KMP UI Layer") {
        val viewModel = remember { DetailsViewModel() }
        var state by remember { mutableStateOf(viewModel.load("Desktop")) }
        App(
            state = state,
            onRefresh = { state = viewModel.refresh("Desktop") }
        )
    }
}
