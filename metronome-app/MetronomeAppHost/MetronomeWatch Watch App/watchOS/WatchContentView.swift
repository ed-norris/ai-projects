import SwiftUI

struct WatchContentView: View {
    @State private var viewModel = MetronomeViewModel(feedback: WatchBeatHapticOutput())

    var body: some View {
        VStack(spacing: 12) {
            Text("\(viewModel.bpm)")
                .font(.system(size: 36, weight: .bold, design: .rounded))
                .monospacedDigit()

            HStack {
                Button("-") { viewModel.setBPM(viewModel.bpm - 1) }
                Button("+") { viewModel.setBPM(viewModel.bpm + 1) }
            }

            Button(viewModel.isRunning ? "Stop" : "Start") {
                viewModel.toggle()
            }
            .buttonStyle(.borderedProminent)

            Text("#\(viewModel.beatCount)")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical)
    }
}
