import SwiftUI
import SharedLogic

struct ContentView: View {
    private let viewModel = HomeViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("KMP Native UI")
                .font(.title)
            Text(viewModel.screenState(platform: "iOS"))
        }
        .padding()
    }
}
