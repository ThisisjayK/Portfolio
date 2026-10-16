import * as React from "react"
import { createRoot } from "react-dom/client"
import HeadLidLift from "../HeadLidLift"

const portrait = { src: "/portrait-cutout.png", alt: "Illustrated portrait of Jayanth" }
// Test-only files from harness/samples, standing in for the artwork you'll upload in Framer.
const openPortrait = { src: "/harness/samples/open-portrait-TEST.png" }
const five = ["circle", "square", "triangle", "star", "heart"].map(n => ({ src: `/harness/samples/doodle-${n}.svg` }))
const ten = [...five, ...five]

// Default doodles, then uploaded ones at two counts, at two frame sizes.
createRoot(document.getElementById("root")!).render(
  <div className="row">
    <div>
      <p>Built-in doodles · 420 × 476</p>
      <div className="frame" id="builtin" style={{ width: 420, height: 476 }}>
        <HeadLidLift portrait={portrait} />
      </div>
    </div>
    <div>
      <p>Open portrait + 5 uploaded doodles · 420 × 476</p>
      <div className="frame" id="five" style={{ width: 420, height: 476 }}>
        <HeadLidLift portrait={portrait} openPortrait={openPortrait} doodleImages={five} />
      </div>
    </div>
    <div>
      <p>10 uploaded doodles · 320 × 360</p>
      <div className="frame" id="ten" style={{ width: 320, height: 360 }}>
        <HeadLidLift portrait={portrait} doodleImages={ten} hint="Click me" />
      </div>
    </div>
  </div>
)
