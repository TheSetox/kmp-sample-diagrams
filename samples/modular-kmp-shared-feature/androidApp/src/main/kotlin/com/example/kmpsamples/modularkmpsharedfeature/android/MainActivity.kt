package com.example.kmpsamples.modularkmpsharedfeature.android

import android.app.Activity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature.App

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(platform = "Android", detail = sampleDetail())
        }
    }

    private fun sampleDetail(): String = "Modular KMP Shared Feature on Android\nNo shared KMP module in this baseline."
}
