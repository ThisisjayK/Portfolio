// The way out of a letter page: a hand-drawn cross (traced from Jayanth's sketch, 2026-10-17),
// not a button with an "X" in it. One long stroke falls from top-left to bottom-right; a
// shorter one crosses it from bottom-left, both with slightly curled ends. Click or Esc turns
// the page to vapour and goes back to the landing page, where focus returns to the letter.
import { useEffect, useRef } from 'react'
import { useVaporNavigate } from './vapor'
import './CloseCross.css'

export default function CloseCross({ slug }: { slug: string }) {
  const go = useVaporNavigate()
  const btn = useRef<HTMLButtonElement>(null)

  const close = (x?: number, y?: number) => {
    const r = btn.current?.getBoundingClientRect()
    const origin = x !== undefined && y !== undefined ? { x, y } : r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined
    go('/', { origin, state: { fromSlug: slug } })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <button
      ref={btn}
      type="button"
      className="close-cross"
      aria-label="Close, back to the start"
      onClick={(e) => close(e.detail ? e.clientX : undefined, e.detail ? e.clientY : undefined)}
      data-vapor
    >
      <svg viewBox="0 0 350 372" aria-hidden="true">
        <path d="M68 4C80 15 110 60 142 105S290 315 310 340S335 360 342 366" />
        <path d="M202 47C196 55 190 60 142 105S80 170 65 185S15 228 6 236" />
      </svg>
    </button>
  )
}
