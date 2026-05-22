import SwiftUI
import SharedDomain

struct ContentView: View {
    private let viewModel = HomeViewModel()
    @State private var stateText = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Three Layer KMP Domain Simple")
                .font(.title)
            Text(stateText)
            Button("Refresh") {
                stateText = viewModel.refresh(platform: "iOS")
            }
        }
        .padding()
        .onAppear {
            if stateText.isEmpty {
                stateText = viewModel.screenState(platform: "iOS")
            }
        }
    }
}
