package com.example.kmpsamples.threelayerkmpdomainpresentation.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation.App

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
