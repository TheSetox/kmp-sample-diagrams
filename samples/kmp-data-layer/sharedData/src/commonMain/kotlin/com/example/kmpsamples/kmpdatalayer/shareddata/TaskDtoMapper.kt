package com.example.kmpsamples.kmpdatalayer.shareddata

class TaskDtoMapper {
    fun map(raw: String): String = raw.replaceFirstChar { it.uppercase() }
}
