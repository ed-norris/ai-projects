import Foundation

public protocol Cancellable {
    func cancel()
}

public protocol BeatScheduler: AnyObject {
    @discardableResult
    func scheduleRepeating(every interval: Duration, _ action: @escaping @Sendable () -> Void) -> Cancellable
}

public final class NoopCancellable: Cancellable {
    public init() {}
    public func cancel() {}
}

public final class DispatchBeatScheduler: BeatScheduler {
    private let queue: DispatchQueue

    public init(queue: DispatchQueue = .main) {
        self.queue = queue
    }

    public func scheduleRepeating(every interval: Duration, _ action: @escaping @Sendable () -> Void) -> Cancellable {
        let intervalSeconds = interval.timeInterval
        let timer = DispatchSource.makeTimerSource(queue: queue)
        timer.schedule(deadline: .now() + intervalSeconds, repeating: intervalSeconds)
        timer.setEventHandler(handler: action)
        timer.resume()

        return DispatchTimerCancellable(timer: timer)
    }
}

private final class DispatchTimerCancellable: Cancellable {
    private var timer: DispatchSourceTimer?

    init(timer: DispatchSourceTimer) {
        self.timer = timer
    }

    func cancel() {
        timer?.cancel()
        timer = nil
    }
}

private extension Duration {
    var timeInterval: TimeInterval {
        let components = self.components
        return TimeInterval(components.seconds) + TimeInterval(components.attoseconds) / 1_000_000_000_000_000_000
    }
}
