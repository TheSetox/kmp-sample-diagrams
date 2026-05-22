package com.example.kmpsamples.modularkmpdatalayer.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "Modular KMP Data Layer\n\nFeature One (native Android)\n" +
                    HomeViewModel().screenState("Android") +
                    "\n\nFeature Two (shared data)\n" +
                    DetailsViewModel().screenState("Android")
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }
}
