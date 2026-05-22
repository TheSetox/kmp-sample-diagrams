package com.example.kmpsamples.modularkmppresentationlayer.android

import androidx.activity.ComponentActivity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(
                platform = "Android",
                repository = DetailsRepository(DetailsDataSource())
            )
        }
    }
}
