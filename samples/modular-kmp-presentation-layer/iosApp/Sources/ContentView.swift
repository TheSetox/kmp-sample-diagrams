import SwiftUI
import UIKit
import FeatureTwoSharedPresentation

struct ContentView: View {
    private let repository = IosDetailsRepository(dataSource: DetailsDataSource())

    var body: some View {
        ComposeHostView(repository: repository)
            .ignoresSafeArea()
    }
}

struct ComposeHostView: UIViewControllerRepresentable {
    let repository: DetailsRepository

    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController(platform: "iOS", repository: repository)
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
