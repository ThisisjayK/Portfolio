// A box in the hero's top-left slot that rolls over as you scroll (Jayanth, 2026-10-17).
// It's a four-sided box seen edge-on: the line drawing faces you, the "jaykay 2026" card is on top,
// then the line drawing again behind and the card underneath. Each scroll gesture rolls it a quarter
// turn, so the two faces alternate: scrolling down tips the front face up and away and brings
// the next one up from below; scrolling up rolls it back. The page keeps scrolling normally; one
// continuous scroll (including trackpad momentum) counts as one roll. Clicking it always goes to
// the top of the landing page. It lives on the landing page only: a letter click turns it to
// pieces with everything else (grid hop), and letter pages show a drawn cross instead (CloseCross). Unlike
// the letters, scrolling never hides it: it's fixed to the screen for the whole landing page, over the bloom, the flood and the sections after (Jayanth, 2026-10-17).
import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
// The collage face became Jayanth's line drawing of the same scene (2026-10-17), recoloured to
// the theme blue; collage.webp is kept. On the blue screen the drawing turns white and the face
// takes the page's blue (Jayanth, 2026-10-17), cross-fading as the hero hands over to the blue.
import lineArt from '../assets/box/line-art.webp'
import lineArtWhite from '../assets/box/line-art-white.webp'
import jaykay from '../assets/box/jaykay-2026.svg'
import { useCards } from './Cards'
import './RollBox.css'

// A pause this long between scroll events starts a new gesture.
const GESTURE_GAP = 250

// Each face: its image, and the white version for the blue screen (if it needs one; the jaykay
// card is already white on the theme blue).
const FACES: { src: string; onBlue?: string }[] = [
  { src: lineArt, onBlue: lineArtWhite },
  { src: jaykay },
  { src: lineArt, onBlue: lineArtWhite },
  { src: jaykay },
]

export default function RollBox() {
  const [turn, setTurn] = useState(0)
  const { pathname } = useLocation()
  const { onPink } = useCards()
  const front = ((turn % 4) + 4) % 4

  // Already on the landing page: a click goes back to its top instead of doing nothing.
  const toTop = (e: MouseEvent) => {
    if (pathname !== '/') return
    e.preventDefault()
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    let lastY = window.scrollY
    let lastAt = 0
    let lastStep = 0
    const onScroll = () => {
      const y = window.scrollY
      if (y === lastY) return // no movement (e.g. a late duplicate event): not part of a gesture
      // Ignore Safari's rubber-band bounce past either end of the page (it flips direction).
      if (y < 0 || y > document.documentElement.scrollHeight - window.innerHeight) return
      const now = performance.now()
      // Work out the direction now: the state updater runs later, after lastY has moved on.
      const step = y > lastY ? 1 : -1
      // A new gesture: after a pause, or as soon as the direction flips (trackpad momentum can
      // still be firing when you reverse, so a pause alone would miss it).
      if (now - lastAt > GESTURE_GAP || step !== lastStep) setTurn((t) => t + step)
      lastStep = step
      lastY = y
      lastAt = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={onPink ? 'roll-slot roll-slot--on-blue' : 'roll-slot'}>
      <div className="roll-cell">
        {/* data-hop: it breaks up with the rest of the page when a letter is clicked. */}
        <Link to="/" className="roll-link" onClick={toTop} aria-label="jaykay, home" data-hop>
          <span className="roll-box" style={{ '--turn': turn } as CSSProperties} aria-hidden="true">
            {FACES.map((face, k) => (
              <span key={k} className="roll-face" style={{ '--k': k } as CSSProperties} data-front={k === front || undefined}>
                <img className="roll-img" src={face.src} alt="" draggable={false} />
                {face.onBlue && <img className="roll-img roll-img--on-blue" src={face.onBlue} alt="" draggable={false} />}
              </span>
            ))}
          </span>
        </Link>
      </div>
    </div>
  )
}
