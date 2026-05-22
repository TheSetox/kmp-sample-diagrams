package com.example.kmpsamples.kmppresentationdatalayer.android

import androidx.activity.ComponentActivity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.kmppresentationdatalayer.shareddata.TaskRepository
import com.example.kmpsamples.kmppresentationdatalayer.sharedpresentation.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(platform = "Android", repository = TaskRepository())
        }
    }
}
