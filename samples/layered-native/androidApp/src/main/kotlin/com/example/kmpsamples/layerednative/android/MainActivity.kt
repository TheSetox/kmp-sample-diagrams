package com.example.kmpsamples.layerednative.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "Layered Native\n" + sampleDetail()
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }

    private fun sampleDetail(): String = "Layered Native on Android\nNo shared KMP module in this baseline."
}
