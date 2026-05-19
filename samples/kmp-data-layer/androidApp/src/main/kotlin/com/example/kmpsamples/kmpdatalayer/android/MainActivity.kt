package com.example.kmpsamples.kmpdatalayer.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import com.example.kmpsamples.kmpdatalayer.shareddata.SampleMessage

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "KMP Data Layer\n" + sampleDetail()
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }

    private fun sampleDetail(): String = SampleMessage().message("Android")
}
