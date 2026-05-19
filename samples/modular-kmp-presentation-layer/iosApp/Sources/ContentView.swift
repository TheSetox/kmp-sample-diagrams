import SwiftUI
import FeatureTwoSharedPresentation

struct ContentView: View {
    private let message = SampleMessage().message(platform: "iOS")

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Modular KMP Presentation Layer")
                .font(.title)
            Text(message)
        }
        .padding()
    }
}
