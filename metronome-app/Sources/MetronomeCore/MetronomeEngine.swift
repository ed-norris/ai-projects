import Foundation

@MainActor
public final class MetronomeEngine {
    public private(set) var state: MetronomeState

    private let scheduler: BeatScheduler
    private var beatTask: Cancellable?
    private var onBeat: (@Sendable (UInt64) -> Void)?

    public init(state: MetronomeState = .init(), scheduler: BeatScheduler = DispatchBeatScheduler()) {
        self.state = state
        self.scheduler = scheduler
    }

    public func setOnBeat(_ callback: (@Sendable (UInt64) -> Void)?) {
        onBeat = callback
    }

    public func setBPM(_ bpm: Int) {
        state.setBPM(bpm)

        if state.isRunning {
            restartTimer()
        }
    }

    public func start() {
        guard !state.isRunning else { return }

        state.setRunning(true)
        restartTimer()
    }

    public func stop() {
        guard state.isRunning else { return }

        state.setRunning(false)
        beatTask?.cancel()
        beatTask = nil
    }

    public func toggle() {
        state.isRunning ? stop() : start()
    }

    private func restartTimer() {
        beatTask?.cancel()
        beatTask = scheduler.scheduleRepeating(every: state.beatInterval) { [weak self] in
            Task { @MainActor [weak self] in
                self?.tick()
            }
        }
    }

    private func tick() {
        guard state.isRunning else { return }

        state.advanceBeat()
        onBeat?(state.beatCount)
    }
}
