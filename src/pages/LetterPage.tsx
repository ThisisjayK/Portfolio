// One page per clickable letter of the hero's A–Z (Jayanth, 2026-10-17, after aiu.is).
// Empty on purpose: a heading, a subheading and the text, in one column in the middle of the
// page, all in the accent. A hand-drawn cross at the right end of the heading row is the way
// back (it scrolls with the text; Esc works from anywhere). The page condenses
// out of vapour on arrival and turns back into vapour on the way out (vapor.ts).
// The page itself never scrolls: it's one screen, and only the text column scrolls inside it,
// fading out as it moves up (Jayanth, 2026-10-17: "only the text should move up").
import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import CloseCross from '../components/CloseCross'
import { condense } from '../components/vapor'
import type { LetterPage as Entry } from '../content/letters'
import './LetterPage.css'

export default function LetterPage({ page }: { page: Entry }) {
  const shell = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    // Focus the text so the arrow keys and space scroll it straight away.
    scroller.current?.focus({ preventScroll: true })
    if (reduced || !shell.current) return
    return condense(shell.current)
  }, [page, reduced])


  return (
    <div ref={shell} className="lp-shell">
      <article ref={scroller} className="lp" aria-labelledby="lp-title" tabIndex={-1}>
      <div className="lp-column">
        <div className="lp-head">
          <h1 id="lp-title" className="display lp-title" data-vapor>
            {page.topic}
          </h1>
          <CloseCross slug={page.slug} />
        </div>
        {page.subtitle && (
          <h2 className="display lp-sub" data-vapor>
            {page.subtitle}
          </h2>
        )}
        {page.body.map((p, k) => (
          <p key={k} className="lp-text" data-vapor>
            {p}
          </p>
        ))}
      </div>
      </article>
    </div>
  )
}
