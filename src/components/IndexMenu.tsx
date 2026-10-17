// The full-screen index, opened from the nav's "Menu" button (structure after aiu.is):
// numbered chapters on the left, an A–Z grid on the right. Letters that stand for one of
// Jayanth's interests are circled and open that interest's note; the letters swell gently
// toward the cursor. Esc, Close or picking an item closes it; focus returns to the button.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useCards, type CardName } from './Cards'
import NoteCard from './NoteCard'
import { notes } from '../content/notes'
import './IndexMenu.css'

type Item = { label: string; to?: string; card?: CardName }
type Chapter = { code: string; title: string; items: Item[] }

const chapters: Chapter[] = [
  { code: 'W', title: 'Work', items: [{ label: 'Stage Zero Health', card: 'work' }] },
  { code: 'A', title: 'About', items: [{ label: 'About me', to: '/about' }] },
  { code: 'P', title: 'Playground', items: [{ label: 'Mood board (in progress)', to: '/playground' }] },
  { code: 'C', title: 'Contact', items: [{ label: 'Say hi', card: 'contact' }] },
]

// Letter → note key (src/content/notes.ts, from about-me.md 1b). Anime sits on O for One Piece.
const circled: Record<string, { key: string; topic: string }> = {
  A: { key: 'arsenal', topic: 'Arsenal' },
  C: { key: 'cooking', topic: 'Cooking' },
  D: { key: 'drake', topic: 'Drake' },
  F: { key: 'football', topic: 'Football' },
  G: { key: 'gaming', topic: 'Gaming' },
  O: { key: 'anime', topic: 'One Piece' },
  P: { key: 'plants', topic: 'Plants' },
  R: { key: 'running', topic: 'Running' },
}
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const ease = [0.22, 1, 0.36, 1] as const

type Props = { open: boolean; onClose: () => void }

export default function IndexMenu({ open, onClose }: Props) {
  const { openCard } = useCards()
  const reduced = useReducedMotion()
  const [noteKey, setNoteKey] = useState<string | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const noteOpen = noteKey !== null

  // While open: the page behind is inert and doesn't scroll; Esc closes (a note first).
  useEffect(() => {
    if (!open) return
    const root = document.getElementById('root')
    const html = document.documentElement
    const returnTo = document.activeElement as HTMLElement | null
    root?.setAttribute('inert', '')
    html.style.overflow = 'hidden'
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('.index-link')?.focus())
    return () => {
      root?.removeAttribute('inert')
      html.style.overflow = ''
      returnTo?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open || noteOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, noteOpen, onClose])

  // Letters swell toward the cursor: transform only, written once per frame.
  useEffect(() => {
    const el = grid.current
    if (!open || reduced || !el || !matchMedia('(pointer: fine)').matches) return
    const cells = Array.from(el.querySelectorAll<HTMLElement>('.index-letter'))
    let frame = 0
    let px = -1e4
    let py = -1e4
    const draw = () => {
      frame = 0
      for (const c of cells) {
        const r = c.getBoundingClientRect()
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py)
        const k = Math.max(0, 1 - d / 180)
        c.style.setProperty('--swell', (1 + 0.7 * k * k).toFixed(3))
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
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cells.forEach((c) => c.style.removeProperty('--swell'))
    }
  }, [open, reduced])

  const pickCard = (name: CardName) => {
    onClose()
    openCard(name)
  }

  let n = 0
  const noteIndex = notes.findIndex((x) => x.key === noteKey)

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          ref={panel}
          id="index-menu"
          className="index"
          role="dialog"
          aria-modal="true"
          aria-label="Index"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease }}
        >
          <header className="index-top mono">
            <span aria-hidden="true">Index</span>
            <button type="button" className="index-close mono" onClick={onClose}>
              Close <span aria-hidden="true">(Esc)</span>
            </button>
          </header>

          <nav className="index-list" aria-label="Site index">
            {chapters.map((ch, i) => (
              <m.section
                key={ch.code}
                className="index-chapter"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease, delay: 0.04 * i }}
              >
                <h2 className="index-chapter-title">
                  <span className="index-code mono" aria-hidden="true">{ch.code}.</span>
                  <span className="index-chapter-name">{ch.title}</span>
                </h2>
                <ol className="index-items" start={n + 1}>
                  {ch.items.map((item) => {
                    n += 1
                    const num = <span className="index-num mono" aria-hidden="true">{n}.</span>
                    return (
                      <li key={item.label}>
                        {num}
                        {item.to ? (
                          <Link className="index-link" to={item.to} onClick={onClose}>
                            <span>{item.label}</span>
                          </Link>
                        ) : (
                          <button type="button" className="index-link" onClick={() => pickCard(item.card!)}>
                            <span>{item.label}</span>
                          </button>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </m.section>
            ))}
          </nav>

          <div className="index-alpha">
            <p className="index-hint mono" id="index-hint">Circled letters are things I love. Pick one.</p>
            <div ref={grid} className="index-grid" role="group" aria-labelledby="index-hint">
              {LETTERS.map((l) => {
                const hit = circled[l]
                const note = hit ? notes.find((x) => x.key === hit.key) : undefined
                if (!note) {
                  return (
                    <span key={l} className="index-letter" aria-hidden="true">
                      <span>{l}</span>
                    </span>
                  )
                }
                return (
                  <button
                    key={l}
                    type="button"
                    className="index-letter is-circled"
                    onClick={() => setNoteKey(note.key)}
                    data-key={note.key}
                    aria-label={`${l}, ${hit!.topic}`}
                  >
                    <span>{l}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <p className="index-credit mono">Index after aiu.is</p>

          <AnimatePresence>
            {noteOpen && noteIndex >= 0 && (
              <NoteCard
                note={notes[noteIndex]}
                index={noteIndex}
                total={notes.length}
                onClose={() => {
                  const k = noteKey
                  setNoteKey(null)
                  requestAnimationFrame(() =>
                    panel.current
                      ?.querySelector<HTMLElement>(`[data-key="${k}"]`)
                      ?.focus(),
                  )
                }}
              />
            )}
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
