// Click the portrait: the top of the head lifts off and the things on Jayanth's mind fly
// out. Each one opens a note. Ported from prototypes/framer-lid/HeadLidLift.tsx.
import { useLayoutEffect, useRef, useState, useId } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import portrait from '../assets/portrait.webp'
import { notes, type Note } from '../content/notes'
import NoteCard from './NoteCard'
import './HeadLid.css'

// Everything is laid out on a 600 × 680 stage; the 300px head sits at (150, 370).
// The stage is scaled so the head matches the size of the .headlid box on the page.
const W = 600
const H = 680
const HEAD = { x: 150, y: 370, size: 300 }
const TILT = [-10, 6, 12, -14, 8, -6, 10]

// Cut line and opening, as % of the portrait (tuned for portrait-cutout.png).
const CUT = 30
const RIM_CENTER = 53.3
const RIM_WIDTH = 58.4
const INK = '#111111'

function landingSpots(n: number) {
  // Doodles were 96 in the prototype; scaled down on 2026-10-16. Still ≥44px on phones.
  const size = n <= 8 ? 72 : 64
  const rows = n <= 4 ? [n] : [Math.floor(n / 2), n - Math.floor(n / 2)]
  const rowY = rows.length === 1 ? [330] : [290, 384]
  const spots: { x: number; y: number; r: number; size: number }[] = []
  rows.forEach((count, row) => {
    const step = count > 1 ? Math.min(size + 24, 360 / (count - 1)) : 0
    for (let j = 0; j < count; j++) {
      spots.push({
        x: 300 + (j - (count - 1) / 2) * step,
        y: rowY[row] + (j % 2 ? -8 : 4),
        r: TILT[spots.length % TILT.length],
        size,
      })
    }
  })
  return spots
}

const BITS = [
  [96, 254, 40], [150, 320, 200], [262, 236, 90], [352, 330, 310], [455, 254, 150],
  [508, 320, 20], [118, 430, 260], [214, 420, 120], [395, 425, 330], [492, 440, 70],
  [300, 344, 180], [160, 270, 290],
]
const BIT_SHAPES = [
  <circle key="c" cx="10" cy="10" r="5" strokeWidth="2.5" />,
  <path key="w" d="M2 12q4-8 8 0t8 0" strokeWidth="2.5" />,
  <path key="t" d="M4 4l12 5l-7 7z" fill="#fff" strokeWidth="2.5" />,
]
const SPEED_LINES = ['M52 236L84 336', 'M30 256L58 340', 'M548 236L516 336', 'M570 256L542 340']

export default function HeadLid() {
  const [open, setOpen] = useState(false)
  const [primed, setPrimed] = useState(false) // doodles load on first hover/focus, not on page load
  const [active, setActive] = useState<Note | null>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)
  const reduced = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const htd = `url(#${uid}-htd)`

  const spots = landingSpots(notes.length)

  // Scale the stage so the 300px head fills the box.
  const box = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(1)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => setK(el.clientWidth / HEAD.size || 1)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const s = HEAD.size
  const rim = { cx: (RIM_CENTER / 100) * s, cy: (CUT / 100) * s, rx: (RIM_WIDTH / 200) * s, ry: s * 0.047 }
  const origin = { x: HEAD.x + rim.cx, y: HEAD.y + rim.cy }
  const state = open ? 'open' : 'closed'

  const headBox: React.CSSProperties = { position: 'absolute', left: HEAD.x, top: HEAD.y, width: s, height: s }
  const img: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }

  const rimShape = (name: string) => (
    <svg viewBox={`0 0 ${s} ${s}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} aria-hidden>
      <m.g
        key={name}
        style={{ transformBox: 'fill-box', originX: 0.5, originY: 0.5 }}
        variants={{
          closed: { scaleY: 0, transition: { delay: 0.76, duration: 0.14 } },
          open: { scaleY: 1, transition: { delay: 0.11, duration: 0.26 } },
        }}
      >
        <ellipse cx={rim.cx} cy={rim.cy} rx={rim.rx} ry={rim.ry} fill="#fff" />
        <ellipse cx={rim.cx} cy={rim.cy} rx={rim.rx} ry={rim.ry} fill={htd} stroke={INK} strokeWidth={5} />
      </m.g>
    </svg>
  )

  const openNote = (note: Note, el: HTMLButtonElement) => {
    lastTrigger.current = el
    setActive(note)
  }
  const closeNote = () => {
    setActive(null)
    // Give focus back to the doodle that opened the note.
    requestAnimationFrame(() => lastTrigger.current?.focus())
  }

  return (
    <div className={open ? 'headlid is-open' : 'headlid'} ref={box} onPointerEnter={() => setPrimed(true)} onFocus={() => setPrimed(true)}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <pattern id={`${uid}-htd`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="2.5" cy="2.5" r="1.9" fill={INK} />
          </pattern>
        </defs>
      </svg>

      <div
        className="headlid-stage"
        style={{ width: W, height: H, left: -HEAD.x * k, top: -HEAD.y * k, transform: `scale(${k})` }}
      >
        <m.div initial={false} animate={state} style={{ position: 'absolute', inset: 0 }}>
          {/* Bottom of the head, below the cut line */}
          <m.div
            style={{ ...headBox, zIndex: 1, originY: 1 }}
            variants={{
              closed: { scaleY: [1, 0.96, 1], transition: { delay: 0.85, duration: 0.26 } },
              open: { scaleY: [1, 0.95, 1.02, 1], transition: { duration: 0.65, times: [0, 0.2, 0.45, 1] } },
            }}
          >
            <img src={portrait} alt="" style={{ ...img, clipPath: `inset(${CUT}% 0 0 0)` }} />
          </m.div>

          {/* The opening at the top of the head */}
          <div style={{ ...headBox, zIndex: 2, pointerEvents: 'none' }}>{rimShape('rim')}</div>

          {/* Speed lines */}
          <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} aria-hidden>
            {SPEED_LINES.map((d, i) => (
              <m.path
                key={d} d={d} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round"
                variants={{
                  closed: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
                  open: { pathLength: 1, opacity: 1, transition: { delay: 0.52 + i * 0.06, duration: 0.35 } },
                }}
              />
            ))}
          </svg>

          {/* Confetti */}
          {BITS.map(([x, y, r], i) => (
            <m.div
              key={i} aria-hidden
              style={{ position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, zIndex: 3, pointerEvents: 'none', opacity: 0 }}
              variants={{
                closed: { opacity: 0, transition: { duration: 0.2 } },
                open: {
                  opacity: [0, 1], x: [origin.x - x, 0], y: [origin.y - y, 0], scale: [0.2, 1], rotate: [0, r],
                  transition: { delay: 0.2 + i * 0.025, duration: 0.8, ease: [0.15, 0.85, 0.3, 1.1] },
                },
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {BIT_SHAPES[i % BIT_SHAPES.length]}
              </svg>
            </m.div>
          ))}

          {/* Doodles: each one is a button that opens its note */}
          {notes.map((note, i) => {
            const { x, y, r, size } = spots[i]
            const dx = origin.x - x
            const dy = origin.y - y
            return (
              <m.button
                key={note.key}
                type="button"
                className="headlid-doodle"
                tabIndex={open ? 0 : -1}
                aria-hidden={!open}
                aria-label={`Open note: ${note.title}`}
                onClick={(e) => openNote(note, e.currentTarget)}
                style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, pointerEvents: open ? 'auto' : 'none', opacity: 0 }}
                variants={{
                  closed: {
                    x: dx, y: dy, scale: 0.3, rotate: 0, opacity: 0,
                    transition: { delay: i * 0.03, duration: 0.38, ease: [0.55, 0, 0.75, 0.3] },
                  },
                  open: {
                    x: [dx, dx * 0.85, dx * 0.1, 0], y: [dy, dy * 0.85, -24, 0],
                    scale: [0.3, 0.45, 1.06, 1], rotate: [0, 0, r, r], opacity: [0, 1, 1, 1],
                    transition: { delay: 0.22 + i * 0.07, duration: 0.9, times: [0, 0.15, 0.7, 1], ease: [0.2, 0.8, 0.2, 1] },
                  },
                }}
                whileHover={reduced ? undefined : { scale: 1.08 }}
                whileTap={reduced ? undefined : { scale: 0.96 }}
              >
                {primed && <img src={note.doodle} alt="" draggable={false} />}
              </m.button>
            )
          })}

          {/* The lid: the top of the head above the cut line */}
          <m.div
            style={{ ...headBox, zIndex: 4, pointerEvents: 'none', originX: RIM_CENTER / 100, originY: CUT / 100 }}
            variants={{
              closed: { x: 0, y: 0, rotate: 0, transition: { delay: 0.38, duration: 0.48, ease: [0.6, 0, 0.4, 1] } },
              open: {
                x: [0, 0, -8, -6], y: [0, 6, -250, -232], rotate: [0, 0, -13, -10],
                transition: { duration: 1, times: [0, 0.12, 0.68, 1], ease: [0.3, 0.6, 0.3, 1] },
              },
            }}
          >
            {rimShape('underside')}
            {/* Overlap the bottom piece by a hair so no seam shows when closed */}
            <img src={portrait} alt="" style={{ ...img, clipPath: `inset(0 0 calc(${100 - CUT}% - 1.5px) 0)` }} />
          </m.div>

          {/* Click target: the face */}
          <button
            type="button"
            className="headlid-face"
            onClick={() => { setPrimed(true); setOpen((o) => !o) }}
            aria-expanded={open}
            aria-label={open ? 'Close my head' : "Ink illustration of Jayanth. Open my head to see what's on my mind"}
            style={{ ...headBox, zIndex: 5 }}
          />

          {/* Hint: appears once, no looping motion */}
          <m.div
            aria-hidden
            className="headlid-hint mono"
            style={{ left: origin.x, top: HEAD.y + 6 }}
            variants={{ closed: { opacity: 1, transition: { delay: 1 } }, open: { opacity: 0, transition: { duration: 0.15 } } }}
          >
            Pop the lid
          </m.div>
        </m.div>
      </div>

      <AnimatePresence>
        {active && (
          <NoteCard
            key={active.key}
            note={active}
            index={notes.indexOf(active)}
            total={notes.length}
            onClose={closeNote}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
