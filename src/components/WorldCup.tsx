// The World Cup on the Arsenal F.C page (Jayanth, 2026-10-19): his photos from Boston Stadium in a
// bending carousel (click a photo to open it), vendored from React Bits (FlexCarousel). The
// holo-card selfie that sat above it was removed the same day at his request. The carousel
// leaves vertical scrolling to the page (captureWheel off), since the text column scrolls
// inside a fixed screen.
import FlexCarousel from './FlexCarousel'
import { worldCupPhotos } from '../content/worldcup'
import './WorldCup.css'

export default function WorldCup() {
  return (
    <section className="world-cup" aria-label="World Cup 2026 photos">
      <div className="world-cup-reel">
        <FlexCarousel
          items={worldCupPhotos}
          preset="liquid"
          intro="rise"
          cardHeight={0.62}
          gap={12}
          squeeze={0.15}
          captureWheel={false}
          focusOnClick
          captions
        />
      </div>
    </section>
  )
}
