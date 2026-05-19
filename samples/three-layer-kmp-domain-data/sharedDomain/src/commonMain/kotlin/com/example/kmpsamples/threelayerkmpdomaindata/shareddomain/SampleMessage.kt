package com.example.kmpsamples.threelayerkmpdomaindata.shareddomain

import com.example.kmpsamples.threelayerkmpdomaindata.shareddata.SampleMessage as DependencyMessage

class SampleMessage {
    private val dependency = DependencyMessage()

    fun message(platform: String): String =
        "Domain shared by Three Layer KMP Domain And Data for $platform. " + dependency.message(platform)
}
