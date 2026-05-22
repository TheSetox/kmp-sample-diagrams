package com.example.kmpsamples.modularkmpdatalayer.featuretwoshareddata

class DetailsDtoMapper {
    fun map(raw: String): String = raw.replaceFirstChar { it.uppercase() }
}
