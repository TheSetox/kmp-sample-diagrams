import SwiftUI
import SharedData

struct ContentView: View {
    private let viewModel = HomeViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("KMP Data Layer")
                .font(.title)
            Text(viewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
