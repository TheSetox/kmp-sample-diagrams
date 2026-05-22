package com.example.kmpsamples.modularkmpdatalayer.android.featureone

import android.content.Context
import android.widget.TextView

class FeatureOneScreen(
    private val viewModel: HomeViewModel = HomeViewModel()
) {
    fun createView(context: Context, platform: String): TextView =
        TextView(context).apply {
            text = "Feature One (native $platform)\n" + viewModel.screenState(platform)
            textSize = 20f
        }
}
