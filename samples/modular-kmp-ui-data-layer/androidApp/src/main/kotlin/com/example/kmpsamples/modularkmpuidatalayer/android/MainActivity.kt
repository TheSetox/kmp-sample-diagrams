package com.example.kmpsamples.modularkmpuidatalayer.android

import android.app.Activity
import android.os.Bundle
import androidx.activity.compose.setContent
import com.example.kmpsamples.modularkmpuidatalayer.featuretwosharedui.App
import com.example.kmpsamples.modularkmpuidatalayer.featuretwoshareddata.SampleMessage

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App(platform = "Android", detail = sampleDetail())
        }
    }

    private fun sampleDetail(): String = SampleMessage().message("Android")
}
