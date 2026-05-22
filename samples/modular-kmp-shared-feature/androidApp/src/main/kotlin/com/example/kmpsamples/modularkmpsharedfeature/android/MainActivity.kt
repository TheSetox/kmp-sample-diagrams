package com.example.kmpsamples.modularkmpsharedfeature.android

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
import com.example.kmpsamples.modularkmpsharedfeature.android.featureone.FeatureOneScreen
import com.example.kmpsamples.modularkmpsharedfeature.featuretwosharedfeature.App

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
                        Text("Modular KMP Shared Feature")
                        FeatureOneScreen(platform = "Android")
                        App(
                            platform = "Android",
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}
