import SwiftUI
import FeatureTwoSharedData

struct ContentView: View {
    private let detailsViewModel = DetailsViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Data Layer")
                .font(.title)
            FeatureOneView(platform: "iOS")
            Text("Feature Two (shared data)")
                .font(.headline)
            Text(detailsViewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
