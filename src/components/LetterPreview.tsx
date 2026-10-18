// A small preview of a letter page's article, shown beside the hovered (or keyboard-focused)
// item that links to it: the index nav's items now, the hero's A–Z before (Jayanth, 2026-10-17;
// in the spirit of React Bits Pro's "Hover Preview", written from scratch, not installed). It
// springs out from the item's side: the title, then the first lines of the article, clamped.
// Its top lines up with the item's; near the right edge it opens to the left instead. It's only
// a preview: the item stays the thing you click. Positioned against the viewport (fixed).
import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import type { LetterPage } from '../content/letters'
import './LetterPreview.css'

type Props = { page: LetterPage | null; anchor: HTMLElement | null; id: string }

const GAP = 14 // px between the letter and the card

// The article's opening without the drafting notes ("[Needs your answer: …]").
const excerpt = (page: LetterPage) =>
  page.body
    .join(' ')
    .replace(/\s*\[Needs your answer:[^\]]*\]/g, '')
    .trim()

export default function LetterPreview({ page, anchor, id }: Props) {
  const card = useRef<HTMLDivElement>(null)
  const [place, setPlace] = useState<{ x: number; y: number; side: 'right' | 'left' } | null>(null)

  // Placed from the item's box, in viewport coordinates.
  useLayoutEffect(() => {
    if (!anchor) return
    const r = anchor.getBoundingClientRect()
    // Inside a column (the index), open beside the whole column so no other item is covered.
    const edge = anchor.closest('[data-preview-edge]')?.getBoundingClientRect().right ?? r.right
    const width = card.current?.offsetWidth ?? Math.min(320, innerWidth * 0.3)
    const side = edge + GAP + width > innerWidth - 16 ? 'left' : 'right'
    setPlace({ x: side === 'right' ? edge + GAP : r.left - GAP, y: r.top, side })
  }, [anchor, page])

  return (
    <AnimatePresence>
      {page && place && (
        <m.div
          key={page.slug}
          ref={card}
          id={id}
          role="tooltip"
          className={`letter-preview letter-preview--${place.side}`}
          style={{ left: place.x, top: place.y, originX: place.side === 'right' ? 0 : 1 }}
          initial={{ opacity: 0, scale: 0.85, x: place.side === 'right' ? -8 : 8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          data-hop
        >
          <p className="letter-preview-kicker mono">{page.letter} · Read</p>
          <p className="letter-preview-title display">{page.topic}</p>
          <p className="letter-preview-body">{excerpt(page)}</p>
        </m.div>
      )}
    </AnimatePresence>
  )
}
