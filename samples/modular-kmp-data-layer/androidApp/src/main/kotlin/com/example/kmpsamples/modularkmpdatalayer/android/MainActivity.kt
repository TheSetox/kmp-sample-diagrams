package com.example.kmpsamples.modularkmpdatalayer.android

import android.app.Activity
import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import com.example.kmpsamples.modularkmpdatalayer.android.featureone.FeatureOneScreen

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(32, 32, 32, 32)
                addView(
                    TextView(this@MainActivity).apply {
                        text = "Modular KMP Data Layer"
                        textSize = 20f
                    }
                )
                addView(FeatureOneScreen().createView(this@MainActivity, "Android"))
                addView(
                    TextView(this@MainActivity).apply {
                        text = "\nFeature Two (shared data)\n" +
                            DetailsViewModel().screenState("Android")
                        textSize = 20f
                    }
                )
            }
        )
    }
}
