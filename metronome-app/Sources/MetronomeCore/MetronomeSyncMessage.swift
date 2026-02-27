import Foundation

public struct MetronomeSyncMessage: Codable, Equatable, Sendable {
    public enum Command: String, Codable, Sendable {
        case start
        case stop
        case setBPM
    }

    public var command: Command
    public var bpm: Int?

    public init(command: Command, bpm: Int? = nil) {
        self.command = command
        self.bpm = bpm
    }
}
