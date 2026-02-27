// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MetronomeCore",
    platforms: [
        .iOS(.v17),
        .watchOS(.v10),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "MetronomeCore",
            targets: ["MetronomeCore"]
        )
    ],
    targets: [
        .target(
            name: "MetronomeCore"
        ),
        .testTarget(
            name: "MetronomeCoreTests",
            dependencies: ["MetronomeCore"]
        )
    ]
)
