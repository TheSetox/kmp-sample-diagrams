import SwiftUI
import UIKit
import FeatureTwoSharedFeature

struct ContentView: View {
    var body: some View {
        ComposeHostView()
            .ignoresSafeArea()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
