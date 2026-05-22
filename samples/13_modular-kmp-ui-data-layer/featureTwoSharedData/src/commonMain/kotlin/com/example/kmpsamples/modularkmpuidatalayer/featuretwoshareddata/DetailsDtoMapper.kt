package com.example.kmpsamples.modularkmpuidatalayer.featuretwoshareddata

class DetailsDtoMapper {
    fun map(raw: String): String = raw.replaceFirstChar { it.uppercase() }
}
