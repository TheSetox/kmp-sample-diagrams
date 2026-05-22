package com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation

interface DetailsRepository {
    fun loadDetailsSummary(platform: String): String
}
