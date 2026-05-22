package com.example.kmpsamples.threelayerkmpdomain.android

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun HomeScreen(
    viewModel: HomeViewModel = HomeViewModel()
) {
    var state by remember { mutableStateOf(viewModel.screenState("Android")) }

    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Three Layer KMP Domain")
                Text(state)
                Button(onClick = { state = viewModel.refresh("Android") }) {
                    Text("Refresh")
                }
            }
        }
    }
}
