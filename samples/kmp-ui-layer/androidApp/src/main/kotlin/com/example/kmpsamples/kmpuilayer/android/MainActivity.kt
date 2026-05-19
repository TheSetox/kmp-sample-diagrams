package com.example.kmpsamples.kmpuilayer.android

import android.app.Activity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.kmpuilayer.sharedui.App

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(platform = "Android", detail = sampleDetail())
        }
    }

    private fun sampleDetail(): String = "KMP UI Layer on Android\nNo shared KMP module in this baseline."
}
