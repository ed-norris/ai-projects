import AVFAudio
import AudioToolbox

@MainActor
final class iOSBeatAudioOutput: BeatFeedbackOutput {
    init() {
        configureAudioSession()
    }

    func emitBeat() {
        AudioServicesPlaySystemSound(1104)
    }

    private func configureAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default)
            try session.setActive(true)
        } catch {
            assertionFailure("Failed to configure AVAudioSession: \(error)")
        }
    }
}
