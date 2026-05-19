package com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation

import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.SampleMessage as DependencyMessage

class SampleMessage {
    private val dependency = DependencyMessage()

    fun message(platform: String): String =
        "Presentation shared by Three Layer KMP Domain And Presentation for $platform. " + dependency.message(platform)
}
