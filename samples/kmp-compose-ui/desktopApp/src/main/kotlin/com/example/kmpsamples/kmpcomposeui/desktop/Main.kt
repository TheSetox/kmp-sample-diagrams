package com.example.kmpsamples.kmpcomposeui.desktop

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.kmpcomposeui.shared.App

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "KMP Compose UI") {
        val viewModel = remember { HomeViewModel() }
        var state by remember { mutableStateOf(viewModel.load("Desktop")) }
        App(
            state = state,
            onRefresh = { state = viewModel.refresh("Desktop") }
        )
    }
}
