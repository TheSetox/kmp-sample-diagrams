package com.example.kmpsamples.kmppresentationlayer.android

import androidx.activity.ComponentActivity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.kmppresentationlayer.sharedpresentation.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(
                platform = "Android",
                repository = TaskRepository(TaskDataSource())
            )
        }
    }
}
