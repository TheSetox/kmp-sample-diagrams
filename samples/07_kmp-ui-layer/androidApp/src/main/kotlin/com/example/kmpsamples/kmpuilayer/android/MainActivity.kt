package com.example.kmpsamples.kmpuilayer.android

import androidx.activity.ComponentActivity
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.example.kmpsamples.kmpuilayer.sharedui.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val viewModel = remember { HomeViewModel() }
            var state by remember { mutableStateOf(viewModel.load("Android")) }
            App(
                state = state,
                onRefresh = { state = viewModel.refresh("Android") }
            )
        }
    }
}
