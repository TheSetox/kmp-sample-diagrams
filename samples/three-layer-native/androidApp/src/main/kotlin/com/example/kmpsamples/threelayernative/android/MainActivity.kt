package com.example.kmpsamples.threelayernative.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import com.example.kmpsamples.threelayernative.android.presentation.HomeViewModel

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "Three Layer Native\n" + HomeViewModel().screenState("Android")
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }
}
