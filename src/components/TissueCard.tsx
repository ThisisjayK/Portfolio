// A floating card that rises in from the bottom, textured like crumpled tissue paper
// (opaque). Pink over the white silhouette screen; white once you're on the pink.
import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useCards } from './Cards'
import './TissueCard.css'

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode }

export default function TissueCard({ open, title, onClose, children }: Props) {
  const { onPink } = useCards()
  const panel = useRef<HTMLDivElement>(null)
  const returnTo = useRef<Element | null>(null)

  // Focus moves into the card on open and back to whatever opened it on close; Esc closes.
  useEffect(() => {
    if (!open) return
    returnTo.current = document.activeElement
    requestAnimationFrame(() => panel.current?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      ;(returnTo.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Clicking outside the card closes it; the page stays visible. */}
          <m.div
            className="tissue-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <m.div
            ref={panel}
            className={onPink ? 'tissue tissue--white' : 'tissue'}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ y: '110vh', rotate: 4 }}
            animate={{ y: 0, rotate: -1.5 }}
            exit={{ y: '110vh', rotate: 4 }}
            transition={{ type: 'spring', bounce: 0.12, duration: 0.6 }}
          >
            <button type="button" className="tissue-close mono" onClick={onClose} aria-label={`Close ${title}`}>
              Close ✕
            </button>
            {children}
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
