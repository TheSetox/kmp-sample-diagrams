import SwiftUI
import UIKit
import FeatureTwoSharedFeature

struct ContentView: View {
    private let homeViewModel = HomeViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Shared Feature")
                .font(.title)
            Text("Feature One (native iOS)")
                .font(.headline)
            Text(homeViewModel.screenState(platform: "iOS"))
            ComposeHostView()
        }
        .padding()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(platform: "iOS")
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
