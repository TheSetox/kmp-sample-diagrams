package com.example.kmpsamples.modularnative.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import com.example.kmpsamples.modularnative.android.featureone.HomeViewModel
import com.example.kmpsamples.modularnative.android.featuretwo.DetailsViewModel

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "Modular Native\n" + HomeViewModel().screenState("Android") + "\n" + DetailsViewModel().screenState("Android")
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }
}
