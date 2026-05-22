import SwiftUI
import UIKit
import FeatureTwoSharedUI

struct ContentView: View {
    private let viewModel = DetailsViewModel()

    var body: some View {
        ComposeHostView(
            state: viewModel.load(platform: "iOS"),
            onRefresh: { _ = viewModel.refresh(platform: "iOS") }
        )
        .ignoresSafeArea()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    let state: DetailsUiState
    let onRefresh: () -> Void

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(state: state, onRefresh: onRefresh)
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
