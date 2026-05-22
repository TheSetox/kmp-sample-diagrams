import SwiftUI

struct FeatureOneView: View {
    let platform: String
    private let viewModel = HomeViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Feature One (native \(platform))")
                .font(.headline)
            Text(viewModel.screenState(platform: platform))
        }
    }
}
