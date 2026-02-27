# Xcode Setup

## Targets

Create:

- iOS app target: `MetronomeiOSApp`
- watchOS app target: `MetronomeWatchApp`

Add local package dependency:

- Path: `/Users/ednorris/dev/ai-projects/metronome-app`
- Product: `MetronomeCore`

## File membership

- Add `App/Shared/*.swift` to both app targets.
- Add `App/iOS/*.swift` to iOS target only.
- Add `App/watchOS/*.swift` to Watch target only.

## Required capabilities/settings

iOS target:

- Background Modes: enable `Audio, AirPlay, and Picture in Picture`.
- Info.plist background mode entry: `audio`.

Watch target:

- Enable WatchConnectivity (linked by importing `WatchConnectivity`).
- Haptics run while app is active; extended background haptics are system-limited.

## Unit tests

Core tests live at:

- `Tests/MetronomeCoreTests/MetronomeCoreTests.swift`

If `swift test` fails with XCTest SDK path issues, run:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

Then rerun:

```bash
swift test
```
