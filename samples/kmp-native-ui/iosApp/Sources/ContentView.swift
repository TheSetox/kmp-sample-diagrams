import SwiftUI
import SharedLogic

struct ContentView: View {
    private let message = SampleMessage().message(platform: "iOS")

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("KMP Native UI")
                .font(.title)
            Text(message)
        }
        .padding()
    }
}
