package com.example.kmpsamples.normalnative.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import com.example.kmpsamples.normalnative.android.HomeViewModel

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "Normal Native\n" + HomeViewModel().screenState("Android")
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }
}
