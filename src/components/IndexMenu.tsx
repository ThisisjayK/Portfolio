// The full-screen index, opened from the nav's "Menu" button (structure after aiu.is):
// numbered chapters with a pink wipe on hover. Esc, Close or picking an item closes it;
// focus returns to the button. (The A–Z moved to the hero on 2026-10-17: LetterGrid.)
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useCards, type CardName } from './Cards'
import './IndexMenu.css'

type Item = { label: string; to?: string; card?: CardName }
type Chapter = { code: string; title: string; items: Item[] }

const chapters: Chapter[] = [
  { code: 'W', title: 'Work', items: [{ label: 'Stage Zero Health', card: 'work' }] },
  { code: 'A', title: 'About', items: [{ label: 'About me', to: '/about' }] },
  { code: 'P', title: 'Playground', items: [{ label: 'Mood board (in progress)', to: '/playground' }] },
  { code: 'C', title: 'Contact', items: [{ label: 'Say hi', card: 'contact' }] },
]

const ease = [0.22, 1, 0.36, 1] as const

type Props = { open: boolean; onClose: () => void }

export default function IndexMenu({ open, onClose }: Props) {
  const { openCard } = useCards()
  const reduced = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)

  // While open: the page behind is inert and doesn't scroll; Esc closes.
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
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const pickCard = (name: CardName) => {
    onClose()
    openCard(name)
  }

  let n = 0

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

          <p className="index-credit mono">Index after aiu.is</p>

        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
