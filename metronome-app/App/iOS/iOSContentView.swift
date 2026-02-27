import SwiftUI

struct iOSContentView: View {
    @State private var viewModel = MetronomeViewModel(feedback: iOSBeatAudioOutput())

    var body: some View {
        VStack(spacing: 20) {
            Text("\(viewModel.bpm) BPM")
                .font(.largeTitle.monospacedDigit())

            Stepper(value: Binding(
                get: { viewModel.bpm },
                set: { viewModel.setBPM($0) }
            ), in: 30...240, step: 1) {
                Text("Tempo")
            }

            Button(viewModel.isRunning ? "Stop" : "Start") {
                viewModel.toggle()
            }
            .buttonStyle(.borderedProminent)

            Text("Beat \(viewModel.beatCount)")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}
