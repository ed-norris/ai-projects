# Metronome App (iPhone + Apple Watch)

This repo contains:

- `MetronomeCore` Swift package with shared timing/state logic.
- Unit tests for core behavior.
- App-layer SwiftUI files for iOS and watchOS targets.

## Open in Xcode

1. Open `/Users/ednorris/dev/ai-projects/metronome-app/Package.swift` in Xcode.
2. Create a new iOS App target and a watchOS App target in your preferred Xcode project/workspace.
3. Add `MetronomeCore` package as a local package dependency from this folder.
4. Add files under `App/Shared` to both iOS and watchOS targets.
5. Add files under `App/iOS` only to iOS target.
6. Add files under `App/watchOS` only to watchOS target.

See `Docs/XcodeSetup.md` for exact target settings.
