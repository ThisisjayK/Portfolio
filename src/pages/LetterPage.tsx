// One page per clickable letter of the hero's A–Z (Jayanth, 2026-10-17, after aiu.is).
// Empty on purpose: a heading, a subheading and the text, in one column in the middle of the
// page, all in the accent. A hand-drawn cross at the right end of the heading row is the way
// back (it scrolls with the text; Esc works from anywhere). The page reassembles
// from a mosaic on arrival and comes apart on the way out (grid hop, pageHop.ts).
// The page itself never scrolls: it's one screen, and only the text column scrolls inside it,
// fading out as it moves up (Jayanth, 2026-10-17: "only the text should move up").
import { Fragment, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import CloseCross from '../components/CloseCross'
import DishMenu from '../components/DishMenu'
import WorldCup from '../components/WorldCup'
import PlaylistPlayer from '../components/PlaylistPlayer'
import DrakeArtifacts from '../components/DrakeArtifacts'
import MapFigure from '../components/MapFigure'
import { chiralaMap, phiPhiMap, snorkelPhoto } from '../content/ocean'
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
          <Fragment key={k}>
            <RevealText className="lp-text" text={p} data-hop />
            {/* Arsenal F.C: Jayanth's Arsenal keyring right after the title-win line (paragraph 4),
                before the World Cup part (Jayanth, 2026-10-19). */}
            {/* Ocean: the Thailand photo (I'm pointed out) and the Phi Phi map after their paragraphs. */}
            {page.slug === 'ocean' && p.includes('first time snorkelling') && (
              <MapFigure {...snorkelPhoto} headAt="target" />
            )}
            {page.slug === 'ocean' && p.includes('Phi Phi') && <MapFigure {...phiPhiMap} />}
            {/* Ocean: the satellite map with Chirala circled, right after the Chirala paragraph. */}
            {page.slug === 'ocean' && p.includes('Chirala') && (
              <MapFigure
                src={chiralaMap.src}
                alt={chiralaMap.alt}
                width={chiralaMap.width}
                height={chiralaMap.height}
                at={chiralaMap.at}
                r={chiralaMap.r}
                circle={chiralaMap.circle}
                label={chiralaMap.label}
              />
            )}
            {page.slug === 'arsenal' && p.includes('first in 22 years') && (
              <figure className="lp-figure" data-hop>
                <img src={arsenalKeyring} alt="Jayanth holding his Arsenal crest keyring, clipped to his backpack" />
              </figure>
            )}
          </Fragment>
        ))}
        {/* Cooking also gets the menu of dishes (Jayanth, 2026-10-18). */}
        {page.slug === 'cooking' && <DishMenu />}
        {/* Arsenal F.C ends with the World Cup photos (Jayanth, 2026-10-19). */}
        {page.slug === 'arsenal' && <WorldCup />}
        {/* Drake: a custom player for Jayanth's two Apple Music playlists (30-second previews),
            then his copy of Drake's book (photo by Jayanth, 2026-10-19). */}
        {page.slug === 'drake' && <PlaylistPlayer />}
        {/* Drake ends with Jayanth's copy of Drake's book (photo by Jayanth, 2026-10-19). */}
        {page.slug === 'drake' && <DrakeArtifacts />}
      </div>
      </article>
    </div>
  )
}
