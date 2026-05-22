package com.example.kmpsamples.modularkmpsharedfeature.android

import androidx.activity.ComponentActivity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(
                platform = "Android",
                nativeFeatureOneSummary = HomeViewModel().screenState("Android")
            )
        }
    }
}
