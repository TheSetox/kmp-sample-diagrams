import SwiftUI
import UIKit
import Shared

struct ContentView: View {
    private let viewModel = HomeViewModel()

    var body: some View {
        ComposeHostView(
            state: viewModel.load(platform: "iOS"),
            onRefresh: { _ = viewModel.refresh(platform: "iOS") }
        )
        .ignoresSafeArea()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    let state: HomeUiState
    let onRefresh: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(state: state, onRefresh: onRefresh)
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
