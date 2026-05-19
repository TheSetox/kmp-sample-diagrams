import SwiftUI
import UIKit
import Shared

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
