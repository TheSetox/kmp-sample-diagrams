package com.example.kmpsamples.threelayerkmpdomainsimple.android

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import com.example.kmpsamples.threelayerkmpdomainsimple.shareddomain.SampleMessage

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(
            TextView(this).apply {
                text = "Three Layer KMP Domain Simple\n" + sampleDetail()
                textSize = 20f
                setPadding(32, 32, 32, 32)
            }
        )
    }

    private fun sampleDetail(): String = SampleMessage().message("Android")
}
