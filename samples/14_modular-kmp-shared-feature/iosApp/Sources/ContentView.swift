import SwiftUI
import UIKit
import FeatureTwoSharedFeature

struct ContentView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Shared Feature")
                .font(.title)
            FeatureOneView(platform: "iOS")
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
