import Foundation
import MetronomeCore

@MainActor
protocol MetronomeSyncing: AnyObject {
    var onMessage: ((MetronomeSyncMessage) -> Void)? { get set }
    func activate()
    func send(_ message: MetronomeSyncMessage)
}
