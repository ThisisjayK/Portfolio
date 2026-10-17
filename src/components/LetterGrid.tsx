// A–Z across the hero's first screen (layout sketched by Jayanth, 2026-10-17): an even 7×5 grid
// over the whole stage, leaving the nav's corner and the silhouette's column empty. Ten letters,
// picked at random on each visit, are lowercase, and each letter gets one of eight fonts at random. Letters that stand for one of Jayanth's
// interests are buttons with an accent amoeba behind them (BlobLetter) that ripples on hover or
// focus; a click turns the page to vapour and opens that letter's own page (vapor.ts, LetterPage).
// The letters swell gently toward a fine cursor.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import BlobLetter from './BlobLetter'
import { useVaporNavigate } from './vapor'
import { LETTER_FONTS, letterPageFor } from '../content/letters'
import '../styles/letterFonts'
import './LetterGrid.css'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// [column, row] on the 7×5 grid, as in Jayanth's sketch. Row 1, columns 1–2 is the nav;
// column 4, rows 2–5 is the silhouette.
const CELLS: Record<string, [number, number]> = {
  C: [3, 1], D: [4, 1], E: [5, 1], F: [6, 1], G: [7, 1],
  A: [1, 2], B: [2, 2], H: [3, 2], I: [5, 2], J: [6, 2], K: [7, 2],
  L: [1, 3], M: [2, 3], N: [3, 3], O: [5, 3], P: [6, 3], Q: [7, 3],
  R: [1, 4], S: [2, 4], T: [3, 4], U: [5, 4], V: [6, 4], W: [7, 4],
  X: [1, 5], Y: [5, 5], Z: [6, 5],
}
const LOWERCASE_COUNT = 10

// Two bold, two italic, two sans, two serif; classes map to the --font-letter-* tokens.
function pickFonts() {
  return Object.fromEntries(
    LETTERS.map((l) => [l, LETTER_FONTS[Math.floor(Math.random() * LETTER_FONTS.length)]]),
  )
}

function pickLowercase() {
  const pool = [...LETTERS]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return new Set(pool.slice(0, LOWERCASE_COUNT))
}

type Props = { hidden?: boolean }

export default function LetterGrid({ hidden }: Props) {
  const reduced = useReducedMotion()
  const grid = useRef<HTMLDivElement>(null)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const lower = useMemo(pickLowercase, [])
  const fonts = useMemo(pickFonts, [])
  const go = useVaporNavigate()
  const { state } = useLocation()

  // Back from a letter page (via the roll box): focus returns to that letter.
  useEffect(() => {
    const slug = (state as { fromSlug?: string } | null)?.fromSlug
    if (slug) grid.current?.querySelector<HTMLElement>(`[data-key="${slug}"]`)?.focus({ preventScroll: true })
  }, [state])

  // Swell toward the cursor: transform only, written once per frame.
  useEffect(() => {
    const el = grid.current
    if (reduced || !el || !matchMedia('(pointer: fine)').matches) return
    const cells = Array.from(el.querySelectorAll<HTMLElement>('.letter'))
    let frame = 0
    let px = -1e4
    let py = -1e4
    const draw = () => {
      frame = 0
      for (const c of cells) {
        const r = c.getBoundingClientRect()
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py)
        const k = Math.max(0, 1 - d / 180)
        c.style.setProperty('--swell', (1 + 0.5 * k * k).toFixed(3))
      }
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const onLeave = () => {
      px = py = -1e4
      if (!frame) frame = requestAnimationFrame(draw)
    }
    // The grid itself lets the pointer through (it spans the whole stage), so listen on the window.
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <>
      <div
        ref={grid}
        className="letters"
        role="group"
        aria-label="A to Z: some letters open a page about something I love"
        aria-hidden={hidden || undefined}
      >
        {LETTERS.map((l) => {
          const hit = letterPageFor(l)
          const [col, row] = CELLS[l]
          const cell = { gridColumn: col, gridRow: row }
          const shown = lower.has(l) ? l.toLowerCase() : l
          if (!hit) {
            return (
              <span key={l} className={`letter letter--${fonts[l]}`} style={cell} aria-hidden="true" data-vapor>
                {shown}
              </span>
            )
          }
          return (
            <button
              key={l}
              type="button"
              className={`letter letter--button letter--${fonts[l]}`}
              style={cell}
              data-key={hit.slug}
              data-vapor
              aria-label={`${l}, ${hit.topic}`}
              tabIndex={hidden ? -1 : undefined}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                go(`/${hit.slug}`, {
                  origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
                })
              }}
              onPointerEnter={() => setActiveKey(hit.slug)}
              onPointerLeave={() => setActiveKey((k) => (k === hit.slug ? null : k))}
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && setActiveKey(hit.slug)}
              onBlur={() => setActiveKey((k) => (k === hit.slug ? null : k))}
            >
              <BlobLetter glyph={shown} active={activeKey === hit.slug} />
            </button>
          )
        })}
      </div>
    </>
  )
}
