package com.example.kmpsamples.threelayerkmpdomainpresentation.sharedpresentation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.example.kmpsamples.threelayerkmpdomainpresentation.shareddomain.TaskRepository

@Composable
fun App(
    platform: String,
    repository: TaskRepository,
    modifier: Modifier = Modifier
) {
    val viewModel = remember { HomeViewModel(repository) }
    var state by remember { mutableStateOf(viewModel.load(platform)) }

    HomeScreen(
        state = state,
        onRefresh = { state = viewModel.refresh(platform) },
        modifier = modifier
    )
}
