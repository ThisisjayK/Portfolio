// A collectible-style note, like the notes in The Last of Us or Ghost of Tsushima.
// Opens over the page; Esc, the Close button or a click outside closes it.
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import * as m from 'motion/react-m'
import type { Note } from '../content/notes'
import './NoteCard.css'

type Props = { note: Note; index: number; total: number; onClose: () => void }

const ease = [0.22, 1, 0.36, 1] as const

export default function NoteCard({ note, index, total, onClose }: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // Keep Tab inside the note: the Close button is its only control.
      if (e.key === 'Tab') {
        e.preventDefault()
        closeBtn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const titleId = `note-${note.key}-title`
  const number = String(index + 1).padStart(2, '0')

  return createPortal(
    <m.div
      className="note-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <m.article
        className="note"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: -1 }}
        exit={{ opacity: 0, scale: 0.97, y: 4 }}
        transition={{ duration: 0.25, ease }}
      >
        <header className="note-head mono">
          <span>Note {number} / {String(total).padStart(2, '0')}</span>
          <span>On my mind</span>
        </header>
        <img className="note-doodle" src={note.doodle} alt={note.doodleAlt} width={96} height={96} />
        <h2 id={titleId} className="display note-title">{note.title}</h2>
        <p className="note-body">{note.body}</p>
        <button ref={closeBtn} type="button" className="note-close mono" onClick={onClose}>
          Close <span aria-hidden>(Esc)</span>
        </button>
      </m.article>
    </m.div>,
    document.body,
  )
}
