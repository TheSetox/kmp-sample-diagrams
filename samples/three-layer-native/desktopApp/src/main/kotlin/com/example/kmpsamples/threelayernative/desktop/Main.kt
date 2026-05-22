package com.example.kmpsamples.threelayernative.desktop

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.example.kmpsamples.threelayernative.desktop.presentation.HomeViewModel

fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "Three Layer Native") {
        MaterialTheme {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Three Layer Native")
                Text(HomeViewModel().screenState("Desktop"))
            }
        }
    }
}
