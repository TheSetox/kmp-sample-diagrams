import SwiftUI
import FeatureTwoSharedData

struct ContentView: View {
    private let message = SampleMessage().message(platform: "iOS")

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Data Layer")
                .font(.title)
            Text(message)
        }
        .padding()
    }
}
