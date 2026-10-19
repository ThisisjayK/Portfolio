// One page per clickable letter of the hero's A–Z (Jayanth, 2026-10-17, after aiu.is).
// Empty on purpose: a heading, a subheading and the text, in one column in the middle of the
// page, all in the accent. A hand-drawn cross at the right end of the heading row is the way
// back (it scrolls with the text; Esc works from anywhere). The page reassembles
// from a mosaic on arrival and comes apart on the way out (grid hop, pageHop.ts).
// The page itself never scrolls: it's one screen, and only the text column scrolls inside it,
// fading out as it moves up (Jayanth, 2026-10-17: "only the text should move up").
import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import CloseCross from '../components/CloseCross'
import DishMenu from '../components/DishMenu'
import WorldCup from '../components/WorldCup'
import titlesRuinEverything from '../assets/drake/titles-ruin-everything.webp'
import arsenalKeyring from '../assets/football/arsenal-keyring.webp'
import RevealText from '../components/RevealText'
import { hopIn } from '../components/pageHop'
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
    return hopIn(shell.current)
  }, [page, reduced])


  return (
    <div ref={shell} className="lp-shell">
      <article ref={scroller} className="lp" aria-labelledby="lp-title" tabIndex={-1}>
      <div className="lp-column">
        <div className="lp-head">
          <h1 id="lp-title" className="display lp-title" data-hop>
            {page.topic}
          </h1>
          <CloseCross slug={page.slug} />
        </div>
        {page.subtitle && (
          <h2 className="display lp-sub" data-hop>
            {page.subtitle}
          </h2>
        )}
        {/* Paragraphs below the first screen blur in line by line as they scroll up. */}
        {page.body.map((p, k) => (
          <RevealText key={k} className="lp-text" text={p} data-hop />
        ))}
        {/* Cooking also gets the menu of dishes (Jayanth, 2026-10-18). */}
        {page.slug === 'cooking' && <DishMenu />}
        {/* Football ends with the World Cup photos (Jayanth, 2026-10-19). */}
        {/* Football: Jayanth's Arsenal keyring (photo by Jayanth, 2026-10-19), then the World Cup. */}
        {page.slug === 'football' && (
          <figure className="lp-figure" data-hop>
            <img src={arsenalKeyring} alt="Jayanth holding his Arsenal crest keyring, clipped to his backpack" />
          </figure>
        )}
        {page.slug === 'football' && <WorldCup />}
        {/* Drake ends with Jayanth's copy of Drake's book (photo by Jayanth, 2026-10-19). */}
        {page.slug === 'drake' && (
          <figure className="lp-figure" data-hop>
            <img src={titlesRuinEverything} alt="The blue cover of Titles Ruin Everything, A Stream of Consciousness by Aubrey Graham and Kenza Samir, published by Phaidon" />
            <figcaption className="mono">Titles Ruin Everything · Aubrey Graham &amp; Kenza Samir · Phaidon</figcaption>
          </figure>
        )}
      </div>
      </article>
    </div>
  )
}
