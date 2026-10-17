// A box in the hero's top-left slot that rolls over as you scroll (Jayanth, 2026-10-17).
// It's a four-sided box seen edge-on: the collage faces you, the "jaykay 2026" card is on top,
// then the collage again behind and the card underneath. Each scroll gesture rolls it a quarter
// turn, so the two faces alternate: scrolling down tips the front face up and away and brings
// the next one up from below; scrolling up rolls it back. The page keeps scrolling normally; one
// continuous scroll (including trackpad momentum) counts as one roll. Clicking it always goes to
// the top of the landing page; from a letter page the page shatters on the way (shatter.ts). Unlike the letters, it's never hidden: it's fixed to the screen
// for the whole landing page, over the bloom, the flood and the sections after (Jayanth, 2026-10-17).
import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useShatterNavigate } from './shatter'
import collage from '../assets/box/collage.webp'
import jaykay from '../assets/box/jaykay-2026.svg'
import './RollBox.css'

// A pause this long between scroll events starts a new gesture.
const GESTURE_GAP = 250

const FACES = [collage, jaykay, collage, jaykay]

export default function RollBox() {
  const [turn, setTurn] = useState(0)
  const { pathname } = useLocation()
  const go = useShatterNavigate()

  // On a letter page: shatter home, and tell the grid which letter to focus.
  // Already on the landing page: a click goes back to its top instead of doing nothing.
  const toTop = (e: MouseEvent) => {
    e.preventDefault()
    if (pathname !== '/') {
      go('/', { origin: { x: e.clientX, y: e.clientY }, state: { fromSlug: pathname.slice(1) } })
      return
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    let lastY = window.scrollY
    let lastAt = 0
    const onScroll = () => {
      const y = window.scrollY
      if (y === lastY) return // no movement (e.g. a late duplicate event): not part of a gesture
      const now = performance.now()
      // Work out the direction now: the state updater runs later, after lastY has moved on.
      const step = y > lastY ? 1 : -1
      if (now - lastAt > GESTURE_GAP) setTurn((t) => t + step)
      lastY = y
      lastAt = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="roll-slot">
      <div className="roll-cell">
        <Link to="/" className="roll-link" onClick={toTop} aria-label="jaykay, home">
          <span className="roll-box" style={{ '--turn': turn } as CSSProperties} aria-hidden="true">
            {FACES.map((src, k) => (
              <span key={k} className="roll-face" style={{ '--k': k } as CSSProperties}>
                <img src={src} alt="" draggable={false} />
              </span>
            ))}
          </span>
        </Link>
      </div>
    </div>
  )
}
