package com.example.kmpsamples.modularkmppresentationlayer.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.kmpsamples.modularkmppresentationlayer.android.featureone.FeatureOneScreen
import com.example.kmpsamples.modularkmppresentationlayer.featuretwosharedpresentation.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("Modular KMP Presentation Layer")
                        FeatureOneScreen(platform = "Android")
                        App(
                            platform = "Android",
                            repository = DetailsRepository(DetailsDataSource()),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}
