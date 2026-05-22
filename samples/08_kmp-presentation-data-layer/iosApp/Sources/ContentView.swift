import SwiftUI
import UIKit
import SharedPresentation
import SharedData

struct ContentView: View {
    private let repository = TaskRepository()

    var body: some View {
        ComposeHostView(repository: repository)
            .ignoresSafeArea()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    let repository: TaskRepository

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(platform: "iOS", repository: repository)
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
