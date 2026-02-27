import Foundation

@MainActor
protocol BeatFeedbackOutput: AnyObject {
    func emitBeat()
}

@MainActor
final class CompositeBeatFeedbackOutput: BeatFeedbackOutput {
    private let outputs: [BeatFeedbackOutput]

    init(outputs: [BeatFeedbackOutput]) {
        self.outputs = outputs
    }

    func emitBeat() {
        for output in outputs {
            output.emitBeat()
        }
    }
}
