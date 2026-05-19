import SwiftUI
import SharedPresentation

struct ContentView: View {
    private let message = SampleMessage().message(platform: "iOS")

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Three Layer KMP Domain And Presentation")
                .font(.title)
            Text(message)
        }
        .padding()
    }
}
