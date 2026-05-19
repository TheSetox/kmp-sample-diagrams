import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Normal Native")
                .font(.title)
            Text("No shared KMP module in this baseline.")
        }
        .padding()
    }
}
