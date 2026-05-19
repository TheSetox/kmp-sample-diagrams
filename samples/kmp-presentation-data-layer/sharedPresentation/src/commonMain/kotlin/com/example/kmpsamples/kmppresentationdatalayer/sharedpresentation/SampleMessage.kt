package com.example.kmpsamples.kmppresentationdatalayer.sharedpresentation

import com.example.kmpsamples.kmppresentationdatalayer.shareddata.SampleMessage as DependencyMessage

class SampleMessage {
    private val dependency = DependencyMessage()

    fun message(platform: String): String =
        "Presentation shared by KMP Presentation And Data Layers for $platform. " + dependency.message(platform)
}
