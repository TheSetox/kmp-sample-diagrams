import SwiftUI

struct ContentView: View {
    private let homeViewModel = HomeViewModel()
    private let detailsViewModel = DetailsViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular Native")
                .font(.title)
            Text(homeViewModel.screenState(platform: "iOS"))
            Text(detailsViewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
