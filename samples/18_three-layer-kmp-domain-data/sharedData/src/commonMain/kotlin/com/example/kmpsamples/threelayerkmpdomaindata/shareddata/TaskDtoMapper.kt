package com.example.kmpsamples.threelayerkmpdomaindata.shareddata

class TaskDtoMapper {
    fun map(raw: String): String = raw.replaceFirstChar { it.uppercase() }
}
