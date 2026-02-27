import Foundation
import MetronomeCore
#if canImport(WatchConnectivity)
import WatchConnectivity
#endif

@MainActor
final class MetronomeConnectivity: NSObject, MetronomeSyncing {
    var onMessage: ((MetronomeSyncMessage) -> Void)?

    #if canImport(WatchConnectivity)
    private let session: WCSession? = WCSession.isSupported() ? .default : nil
    #endif

    override init() {
        super.init()
        #if canImport(WatchConnectivity)
        session?.delegate = self
        #endif
    }

    func activate() {
        #if canImport(WatchConnectivity)
        session?.activate()
        #endif
    }

    func send(_ message: MetronomeSyncMessage) {
        #if canImport(WatchConnectivity)
        guard let session else { return }

        let payload: [String: Any] = [
            "command": message.command.rawValue,
            "bpm": message.bpm as Any
        ]

        if session.isReachable {
            session.sendMessage(payload, replyHandler: nil, errorHandler: nil)
        } else {
            try? session.updateApplicationContext(payload)
        }
        #endif
    }

    private func parse(_ payload: [String: Any]) -> MetronomeSyncMessage? {
        guard let commandRaw = payload["command"] as? String,
              let command = MetronomeSyncMessage.Command(rawValue: commandRaw)
        else {
            return nil
        }

        let bpm = payload["bpm"] as? Int
        return MetronomeSyncMessage(command: command, bpm: bpm)
    }
}

#if canImport(WatchConnectivity)
extension MetronomeConnectivity: WCSessionDelegate {
    nonisolated func session(
        _ session: WCSession,
        didReceiveMessage message: [String: Any]
    ) {
        Task { @MainActor [weak self] in
            guard let parsed = self?.parse(message) else { return }
            self?.onMessage?(parsed)
        }
    }

    nonisolated func session(
        _ session: WCSession,
        didReceiveApplicationContext applicationContext: [String: Any]
    ) {
        Task { @MainActor [weak self] in
            guard let parsed = self?.parse(applicationContext) else { return }
            self?.onMessage?(parsed)
        }
    }

#if os(iOS)
    nonisolated func sessionDidBecomeInactive(_ session: WCSession) {}
    nonisolated func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
#endif

    nonisolated func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {}
}
#endif
