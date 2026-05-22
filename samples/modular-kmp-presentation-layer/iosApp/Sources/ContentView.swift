import SwiftUI
import UIKit
import FeatureTwoSharedPresentation

struct ContentView: View {
    private let repository = IosDetailsRepository(dataSource: DetailsDataSource())

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Presentation Layer")
                .font(.title)
            FeatureOneView(platform: "iOS")
            ComposeHostView(repository: repository)
        }
        .padding()
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
