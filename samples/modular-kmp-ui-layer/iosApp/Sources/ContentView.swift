import SwiftUI
import UIKit
import FeatureTwoSharedUI

struct ContentView: View {
    private let homeViewModel = HomeViewModel()
    private let detailsViewModel = DetailsViewModel()
    @State private var detailsState: DetailsUiState?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP UI Layer")
                .font(.title)
            Text("Feature One (native iOS)")
                .font(.headline)
            Text(homeViewModel.screenState(platform: "iOS"))
            if let detailsState = detailsState {
                ComposeHostView(
                    state: detailsState,
                    onRefresh: { self.detailsState = detailsViewModel.refresh(platform: "iOS") }
                )
            }
        }
        .padding()
        .onAppear {
            if detailsState == nil {
                detailsState = detailsViewModel.load(platform: "iOS")
            }
        }
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
