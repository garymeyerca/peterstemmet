import AppKit

let canvasWidth: CGFloat = 1200
let canvasHeight: CGFloat = 630
let portraitStartX: CGFloat = 720

let inputURL = URL(fileURLWithPath: "assets/peter-headshot.avif")
let outputURL = URL(fileURLWithPath: "assets/social-share.jpg")

guard let portrait = NSImage(contentsOf: inputURL) else {
  fatalError("Could not load \(inputURL.path)")
}

func color(_ red: CGFloat, _ green: CGFloat, _ blue: CGFloat, alpha: CGFloat = 1) -> NSColor {
  NSColor(
    calibratedRed: red / 255,
    green: green / 255,
    blue: blue / 255,
    alpha: alpha
  )
}

func drawText(
  _ text: String,
  in rect: NSRect,
  font: NSFont,
  color: NSColor,
  tracking: CGFloat = 0,
  lineHeight: CGFloat? = nil
) {
  let paragraph = NSMutableParagraphStyle()
  paragraph.lineBreakMode = .byWordWrapping
  if let lineHeight {
    paragraph.minimumLineHeight = lineHeight
    paragraph.maximumLineHeight = lineHeight
  }

  (text as NSString).draw(
    with: rect,
    options: [.usesLineFragmentOrigin, .usesFontLeading],
    attributes: [
      .font: font,
      .foregroundColor: color,
      .kern: tracking,
      .paragraphStyle: paragraph,
    ]
  )
}

let card = NSImage(size: NSSize(width: canvasWidth, height: canvasHeight))
card.lockFocusFlipped(true)

color(7, 26, 43).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: canvasWidth, height: canvasHeight)).fill()

let sourceSide = min(portrait.size.width, portrait.size.height)
let sourceRect = NSRect(
  x: (portrait.size.width - sourceSide) / 2,
  y: (portrait.size.height - sourceSide) / 2,
  width: sourceSide,
  height: sourceSide
)
portrait.draw(
  in: NSRect(x: portraitStartX, y: 0, width: canvasWidth - portraitStartX, height: canvasHeight),
  from: sourceRect,
  operation: .sourceOver,
  fraction: 1,
  respectFlipped: true,
  hints: [.interpolation: NSImageInterpolation.high]
)

color(233, 104, 59).setFill()
NSBezierPath(rect: NSRect(x: 70, y: 66, width: 68, height: 68)).fill()
drawText(
  "PS",
  in: NSRect(x: 84, y: 79, width: 45, height: 38),
  font: NSFont(name: "Georgia-Bold", size: 26) ?? .boldSystemFont(ofSize: 26),
  color: .white
)

drawText(
  "PETER STEMMET",
  in: NSRect(x: 158, y: 79, width: 450, height: 34),
  font: NSFont.systemFont(ofSize: 22, weight: .bold),
  color: .white,
  tracking: 3.2
)

color(233, 104, 59).setFill()
NSBezierPath(rect: NSRect(x: 72, y: 179, width: 46, height: 5)).fill()
drawText(
  "COMMUNICATION THAT HOLDS UP UNDER PRESSURE",
  in: NSRect(x: 136, y: 167, width: 510, height: 40),
  font: NSFont.systemFont(ofSize: 15, weight: .bold),
  color: color(123, 177, 255),
  tracking: 1.8
)

drawText(
  "Clarity when\nthe stakes are high.",
  in: NSRect(x: 70, y: 220, width: 610, height: 240),
  font: NSFont(name: "Georgia", size: 67) ?? .systemFont(ofSize: 67, weight: .medium),
  color: .white,
  tracking: -1.6,
  lineHeight: 77
)

drawText(
  "MEDIA TRAINING  ·  EVENT MODERATION  ·  EXECUTIVE COMMUNICATION",
  in: NSRect(x: 72, y: 552, width: 585, height: 28),
  font: NSFont.systemFont(ofSize: 13, weight: .semibold),
  color: color(215, 224, 230),
  tracking: 0.8
)

card.unlockFocus()

guard
  let tiff = card.tiffRepresentation,
  let bitmap = NSBitmapImageRep(data: tiff),
  let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.88])
else {
  fatalError("Could not render social share image")
}

try jpeg.write(to: outputURL, options: .atomic)

let resize = Process()
resize.executableURL = URL(fileURLWithPath: "/usr/bin/sips")
resize.arguments = ["--resampleHeightWidth", "630", "1200", outputURL.path]
try resize.run()
resize.waitUntilExit()
guard resize.terminationStatus == 0 else {
  fatalError("Could not resize social share image")
}

print("Generated \(outputURL.path) at \(Int(canvasWidth))x\(Int(canvasHeight))")
