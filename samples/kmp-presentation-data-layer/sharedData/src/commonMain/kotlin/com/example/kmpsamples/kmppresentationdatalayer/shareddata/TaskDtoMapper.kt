package com.example.kmpsamples.kmppresentationdatalayer.shareddata

class TaskDtoMapper {
    fun map(raw: String): String = raw.replaceFirstChar { it.uppercase() }
}
