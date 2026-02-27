import Foundation

public struct MetronomeState: Equatable, Sendable {
    public static let minBPM = 30
    public static let maxBPM = 240

    public private(set) var bpm: Int
    public private(set) var isRunning: Bool
    public private(set) var beatCount: UInt64

    public init(bpm: Int = 120, isRunning: Bool = false, beatCount: UInt64 = 0) {
        self.bpm = Self.clampBPM(bpm)
        self.isRunning = isRunning
        self.beatCount = beatCount
    }

    public var secondsPerBeat: TimeInterval {
        60.0 / TimeInterval(bpm)
    }

    public var beatInterval: Duration {
        .milliseconds(Int64((secondsPerBeat * 1_000.0).rounded()))
    }

    public mutating func setBPM(_ newValue: Int) {
        bpm = Self.clampBPM(newValue)
    }

    public mutating func setRunning(_ running: Bool) {
        isRunning = running
    }

    public mutating func advanceBeat() {
        beatCount += 1
    }

    private static func clampBPM(_ value: Int) -> Int {
        min(max(value, minBPM), maxBPM)
    }
}
