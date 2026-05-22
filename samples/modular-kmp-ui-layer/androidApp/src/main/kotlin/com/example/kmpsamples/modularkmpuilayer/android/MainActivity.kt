package com.example.kmpsamples.modularkmpuilayer.android

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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.kmpsamples.modularkmpuilayer.featuretwosharedui.App

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val detailsViewModel = remember { DetailsViewModel() }
            var state by remember { mutableStateOf(detailsViewModel.load("Android")) }
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("Modular KMP UI Layer")
                        Text("Feature One (native Android)")
                        Text(HomeViewModel().screenState("Android"))
                        App(
                            state = state,
                            onRefresh = { state = detailsViewModel.refresh("Android") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}
