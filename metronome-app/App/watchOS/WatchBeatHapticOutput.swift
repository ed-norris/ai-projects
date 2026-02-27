import WatchKit

@MainActor
final class WatchBeatHapticOutput: BeatFeedbackOutput {
    func emitBeat() {
        WKInterfaceDevice.current().play(.click)
    }
}
