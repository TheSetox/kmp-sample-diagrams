import SwiftUI
import UIKit
import FeatureTwoSharedFeature

struct ContentView: View {
    private let homeViewModel = HomeViewModel()

    var body: some View {
        ComposeHostView(nativeFeatureOneSummary: homeViewModel.screenState(platform: "iOS"))
            .ignoresSafeArea()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    let nativeFeatureOneSummary: String

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(platform: "iOS", nativeFeatureOneSummary: nativeFeatureOneSummary)
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
