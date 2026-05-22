import SwiftUI

struct ContentView: View {
    private let homeViewModel = HomeViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Three Layer Native")
                .font(.title)
            Text(homeViewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
