// Three short statements that come into focus one at a time as you scroll (Jayanth,
// 2026-10-17; after neutomni.com's focus section, written from scratch): each is sharp at its
// own moment and blurs either side of it, like a camera racking focus. Since 2026-10-19 the
// lines are life outside work (about.ts `intro.life`; was "Engineer by training." and so on). All three are always in the page for screen readers.
// Reduced motion: all three stay sharp.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { intro } from '../content/about'
import './RackFocus.css'

const LINES = intro.life
const MAX_BLUR = 8 // px
const GLOW_FADE = 0.12 // of the section's scroll, at each end

export default function RackFocus() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const sec = section.current
    if (!sec || reduced) return
    const lines = Array.from(sec.querySelectorAll<HTMLElement>('.rack-line'))
    const glows = Array.from(sec.querySelectorAll<HTMLElement>('.rack-glow'))
    let raf = 0
    const draw = () => {
      raf = 0
      const r = sec.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, sec.offsetHeight - window.innerHeight)))
      const at = p * (lines.length - 1)
      // The glows fade in once the screen is pinned and out before it leaves, so it starts and
      // ends on the same plain blue as the sections either side: no hard edge (Jayanth, 2026-10-19).
      const glow = Math.min(1, p / GLOW_FADE, (1 - p) / GLOW_FADE)
      glows.forEach((g) => (g.style.opacity = glow.toFixed(3)))
      lines.forEach((l, i) => {
        const d = Math.abs(at - i)
        l.style.filter = `blur(${Math.min(MAX_BLUR, d * MAX_BLUR).toFixed(2)}px)`
        l.style.opacity = (1 - Math.min(0.7, d * 0.7)).toFixed(2)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <section ref={section} className={reduced ? 'rack rack--static' : 'rack'} aria-label="Life outside work">
      <div className="rack-stage">
        <div className="rack-glow rack-glow--a" aria-hidden="true" />
        <div className="rack-glow rack-glow--b" aria-hidden="true" />
        <ol className="rack-lines">
          {LINES.map((l) => (
            <li key={l} className="rack-line display">
              {l}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
