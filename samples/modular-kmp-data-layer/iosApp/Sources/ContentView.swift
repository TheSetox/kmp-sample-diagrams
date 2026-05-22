import SwiftUI
import FeatureTwoSharedData

struct ContentView: View {
    private let homeViewModel = HomeViewModel()
    private let detailsViewModel = DetailsViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Data Layer")
                .font(.title)
            Text("Feature One (native iOS)")
                .font(.headline)
            Text(homeViewModel.screenState(platform: "iOS"))
            Text("Feature Two (shared data)")
                .font(.headline)
            Text(detailsViewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
