package com.example.kmpsamples.kmppresentationdatalayer.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import com.example.kmpsamples.kmppresentationdatalayer.sharedpresentation.SampleMessage

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "KMP Presentation And Data Layers\n" + sampleDetail()
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }

    private fun sampleDetail(): String = SampleMessage().message("Android")
}
