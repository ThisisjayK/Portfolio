// The cooking page's menu (Jayanth, 2026-10-18): a numbered list of dishes in big type. On a
// mouse, hovering a dish runs the index's strike (a band wipes through the words, which knock
// out to white) and the dish's photo follows the cursor, leaning a little with the movement.
// Keyboard focus runs the same strike and shows the photo beside the row. Each row is a link:
// a click or tap breaks the page apart (grid hop) and opens the dish's own page (DishPage);
// coming back, focus lands on that row. Reduced motion: the photo sits still at the cursor,
// no lean, and the strike jumps to its end state.
import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { dishes } from '../content/dishes'
import { usePageHop } from './pageHop'
import './DishMenu.css'

const pad = (n: number) => String(n).padStart(2, '0')

// Follow the cursor only where there is one.
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

export default function DishMenu() {
  const reduced = useReducedMotion()
  const [fine, setFine] = useState(finePointer)
  const [active, setActive] = useState<string | null>(null) // photo showing at the cursor
  const go = usePageHop()
  const list = useRef<HTMLOListElement>(null)
  const { state } = useLocation()

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const on = () => setFine(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Back from a dish page: focus its row (which also scrolls the menu into view).
  useEffect(() => {
    const key = (state as { fromDish?: string } | null)?.fromDish
    if (key) list.current?.querySelector<HTMLElement>(`[data-key="${key}"]`)?.focus()
  }, [state])

  const open = (key: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setActive(null)
    const r = e.currentTarget.getBoundingClientRect()
    const origin = e.detail ? { x: e.clientX, y: e.clientY } : { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    go(`/cooking/${key}`, { origin })
  }

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 260, damping: 28, mass: 0.6 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  // Lean with the horizontal lag between the cursor and the photo, capped at 8 degrees.
  const lean = useTransform(() => Math.max(-8, Math.min(8, (x.get() - sx.get()) * 0.12)))

  const move = (e: PointerEvent) => {
    x.set(e.clientX)
    y.set(e.clientY)
  }

  const strikeIn = (e: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    e.currentTarget.dataset.strike = 'in'
  }
  const strikeOut = (e: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    if (e.currentTarget.dataset.strike === 'in') e.currentTarget.dataset.strike = 'out'
  }

  const current = dishes.find((d) => d.key === active)

  return (
    <section className="dish-menu" aria-labelledby="dish-menu-title">
      <h2 id="dish-menu-title" className="dish-menu-title mono" data-hop>
        Menu
      </h2>
      <ol ref={list} className="dish-list">
        {dishes.map((d, i) => (
          <li key={d.key} className="dish">
            <a
              href={`${import.meta.env.BASE_URL}cooking/${d.key}`}
              className="dish-row"
              data-key={d.key}
              onPointerEnter={(e) => {
                if (!fine) return
                strikeIn(e)
                if (reduced) {
                  sx.jump(e.clientX)
                  sy.jump(e.clientY)
                }
                x.set(e.clientX)
                y.set(e.clientY)
                setActive(d.key)
              }}
              onPointerMove={fine ? move : undefined}
              onPointerLeave={(e) => {
                if (!fine) return
                strikeOut(e)
                setActive((k) => (k === d.key ? null : k))
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(':focus-visible')) return
                strikeIn(e)
                if (fine) {
                  // Keyboard: put the photo beside the row instead of at a cursor.
                  const r = e.currentTarget.getBoundingClientRect()
                  sx.jump(r.right + 140)
                  sy.jump(r.top + r.height / 2)
                  x.jump(r.right + 140)
                  y.jump(r.top + r.height / 2)
                  setActive(d.key)
                }
              }}
              onBlur={(e) => {
                strikeOut(e)
                setActive((k) => (k === d.key ? null : k))
              }}
              onClick={(e) => open(d.key, e)}
            >
              <span className="dish-num mono" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="dish-name" data-label={d.name} data-hop>
                {d.name}
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* The photo at the cursor lives on <body>: the text column's fade mask would clip it.
          Decorative here, since the link already names the dish. All photos are mounted so
          switching rows doesn't wait on a download. */}
      {fine &&
        createPortal(
          <motion.div
            className="dish-float"
            aria-hidden="true"
            style={{ x: sx, y: sy, rotate: reduced ? 0 : lean }}
          >
            {dishes.map((d) => (
              <img
                key={d.key}
                src={d.img}
                alt=""
                className="dish-float-img"
                data-on={current?.key === d.key || undefined}
              />
            ))}
          </motion.div>,
          document.body,
        )}
    </section>
  )
}
