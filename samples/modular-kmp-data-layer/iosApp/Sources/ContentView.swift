import SwiftUI
import FeatureTwoSharedData

struct ContentView: View {
    private let viewModel = DetailsViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Data Layer")
                .font(.title)
            Text(viewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
