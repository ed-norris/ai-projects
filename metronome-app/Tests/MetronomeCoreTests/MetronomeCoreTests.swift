import Foundation
import Testing
@testable import MetronomeCore

struct MetronomeCoreTests {
    @Test
    func bpmIsClampedIntoRange() {
        var state = MetronomeState(bpm: 10)
        #expect(state.bpm == 30)

        state.setBPM(400)
        #expect(state.bpm == 240)
    }

    @Test
    func beatIntervalReflectsBPM() {
        let state = MetronomeState(bpm: 120)
        #expect(state.beatInterval == .milliseconds(500))
    }

    @Test
    func syncMessageRoundTripJSON() throws {
        let original = MetronomeSyncMessage(command: .setBPM, bpm: 144)
        let data = try JSONEncoder().encode(original)
        let decoded = try JSONDecoder().decode(MetronomeSyncMessage.self, from: data)
        #expect(decoded == original)
    }

    @Test
    @MainActor
    func startAndStopControlTicks() async {
        let scheduler = TestBeatScheduler()
        let engine = MetronomeEngine(scheduler: scheduler)

        engine.start()
        #expect(engine.state.isRunning)
        #expect(scheduler.scheduledIntervals == [.milliseconds(500)])

        scheduler.fire(times: 3)
        await Task.yield()
        #expect(engine.state.beatCount == 3)

        engine.stop()
        #expect(!engine.state.isRunning)

        scheduler.fire(times: 2)
        await Task.yield()
        #expect(engine.state.beatCount == 3)
    }

    @Test
    @MainActor
    func changingBPMWhileRunningReschedulesTimer() {
        let scheduler = TestBeatScheduler()
        let engine = MetronomeEngine(scheduler: scheduler)

        engine.start()
        engine.setBPM(60)

        #expect(scheduler.scheduledIntervals == [.milliseconds(500), .milliseconds(1000)])
    }
}

private final class TestBeatScheduler: BeatScheduler {
    private final class Token: Cancellable {
        var isCancelled = false

        func cancel() {
            isCancelled = true
        }
    }

    private var handlers: [(token: Token, action: @Sendable () -> Void)] = []
    private(set) var scheduledIntervals: [Duration] = []

    func scheduleRepeating(every interval: Duration, _ action: @escaping @Sendable () -> Void) -> Cancellable {
        let token = Token()
        handlers.append((token: token, action: action))
        scheduledIntervals.append(interval)
        return token
    }

    func fire(times: Int) {
        guard times > 0 else { return }

        for _ in 0..<times {
            let snapshot = handlers
            for entry in snapshot where !entry.token.isCancelled {
                entry.action()
            }
        }
    }
}
