import Foundation
import MetronomeCore
import Observation

@MainActor
@Observable
final class MetronomeViewModel {
    private(set) var bpm: Int
    private(set) var isRunning: Bool
    private(set) var beatCount: UInt64

    private let engine: MetronomeEngine
    private let feedback: BeatFeedbackOutput
    private let sync: MetronomeSyncing

    private var applyingRemoteMessage = false

    init(
        engine: MetronomeEngine = MetronomeEngine(),
        feedback: BeatFeedbackOutput,
        sync: MetronomeSyncing = MetronomeConnectivity()
    ) {
        self.engine = engine
        self.feedback = feedback
        self.sync = sync

        let state = engine.state
        self.bpm = state.bpm
        self.isRunning = state.isRunning
        self.beatCount = state.beatCount

        engine.setOnBeat { [weak self] _ in
            guard let self else { return }
            self.feedback.emitBeat()
            self.refreshFromEngineState()
        }

        sync.onMessage = { [weak self] message in
            self?.applyRemote(message)
        }
        sync.activate()
    }

    func setBPM(_ value: Int) {
        engine.setBPM(value)
        refreshFromEngineState()
        sendIfLocal(MetronomeSyncMessage(command: .setBPM, bpm: bpm))
    }

    func start() {
        engine.start()
        refreshFromEngineState()
        sendIfLocal(MetronomeSyncMessage(command: .start, bpm: bpm))
    }

    func stop() {
        engine.stop()
        refreshFromEngineState()
        sendIfLocal(MetronomeSyncMessage(command: .stop, bpm: bpm))
    }

    func toggle() {
        isRunning ? stop() : start()
    }

    private func applyRemote(_ message: MetronomeSyncMessage) {
        applyingRemoteMessage = true
        defer { applyingRemoteMessage = false }

        if let remoteBPM = message.bpm {
            engine.setBPM(remoteBPM)
        }

        switch message.command {
        case .start:
            engine.start()
        case .stop:
            engine.stop()
        case .setBPM:
            break
        }

        refreshFromEngineState()
    }

    private func sendIfLocal(_ message: MetronomeSyncMessage) {
        guard !applyingRemoteMessage else { return }
        sync.send(message)
    }

    private func refreshFromEngineState() {
        let state = engine.state
        bpm = state.bpm
        isRunning = state.isRunning
        beatCount = state.beatCount
    }
}
