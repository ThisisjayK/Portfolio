// The page-to-page transition for the letters (Jayanth, 2026-10-17, after aiu.is): everything
// marked data-shatter breaks into small chips and glyph fragments that scatter away from the
// click, then the next page builds itself in (TextReveal). One full-screen 2D canvas, drawn only
// while it runs (~0.6s), then removed. The roll box is never marked, so it stays as the anchor.
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'

type Point = { x: number; y: number }

type Chip = {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  glyph: string | null
  font: string
  color: string
  delay: number // s
  life: number // s
}

const MAX_CHIPS = 2400
const SWEEP = 2600 // px/s: how fast the break travels out from the click
const MAX_DELAY = 0.18 // s
const rand = (a: number, b: number) => a + Math.random() * (b - a)

export function shatter(origin: Point, keep?: Element | null): Promise<void> {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('main [data-shatter]')).filter((el) => {
    if (keep && (el === keep || el.contains(keep) || keep.contains(el))) return false
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.top > innerHeight) return false
    return parseFloat(getComputedStyle(el).opacity) > 0.05
  })
  if (!targets.length) return Promise.resolve()

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2072df'
  const chips: Chip[] = []
  const hideAt: [HTMLElement, number][] = []
  const area = targets.reduce((sum, el) => {
    const r = el.getBoundingClientRect()
    return sum + r.width * r.height
  }, 0)
  const density = Math.min(1 / 220, MAX_CHIPS / Math.max(area, 1))

  for (const el of targets) {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const isImage = el instanceof HTMLImageElement || el instanceof HTMLCanvasElement
    const color = isImage ? accent : cs.color
    const text = (el.textContent ?? '').replace(/\s+/g, '')
    const size = Math.max(9, Math.min(parseFloat(cs.fontSize) * 0.5, 28))
    const font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const delay = Math.min(MAX_DELAY, Math.hypot(cx - origin.x, cy - origin.y) / SWEEP)
    hideAt.push([el, delay])
    const n = Math.max(4, Math.round(r.width * r.height * density))
    for (let i = 0; i < n; i++) {
      const x = rand(r.left, r.right)
      const y = rand(r.top, r.bottom)
      // Away from the click, with some scatter; nearer chips leave faster.
      const dx = x - origin.x
      const dy = y - origin.y
      const d = Math.hypot(dx, dy) || 1
      const speed = rand(120, 560) * (1 + 120 / (d + 120))
      const glyph = text && Math.random() < 0.18 ? text[Math.floor(Math.random() * text.length)] : null
      chips.push({
        x,
        y,
        vx: (dx / d) * speed + rand(-140, 140),
        vy: (dy / d) * speed + rand(-140, 140),
        w: Math.random() < 0.5 ? rand(2, 7) : rand(1, 3),
        h: rand(1, 6),
        glyph,
        font,
        color,
        delay: delay + rand(0, 0.06),
        life: rand(0.28, 0.42),
      })
    }
  }

  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(innerWidth * dpr)
  canvas.height = Math.round(innerHeight * dpr)
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '100',
    pointerEvents: 'none',
  })
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return Promise.resolve()
  }
  ctx.scale(dpr, dpr)

  // Each element vanishes the moment its chips appear, so it reads as breaking apart.
  for (const [el, delay] of hideAt) {
    window.setTimeout(() => {
      el.style.transition = 'none'
      el.style.opacity = '0'
    }, delay * 1000)
  }

  const end = Math.max(...chips.map((c) => c.delay + c.life))
  return new Promise((resolve) => {
    const start = performance.now()
    const frame = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (const c of chips) {
        const k = (t - c.delay) / c.life
        if (k < 0 || k > 1) continue
        const s = t - c.delay
        ctx.globalAlpha = 1 - k * k
        ctx.fillStyle = c.color
        const x = c.x + c.vx * s
        const y = c.y + c.vy * s
        if (c.glyph) {
          ctx.font = c.font
          ctx.fillText(c.glyph, x, y)
        } else {
          ctx.fillRect(x, y, c.w, c.h)
        }
      }
      if (t < end) requestAnimationFrame(frame)
      else {
        canvas.remove()
        resolve()
      }
    }
    requestAnimationFrame(frame)
  })
}

type GoOptions = { origin?: Point; keep?: Element | null; state?: unknown }

// Navigate with the shatter. Reduced motion skips it (the page's own fade still runs).
export function useShatterNavigate() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const busy = useRef(false)
  return useCallback(
    (to: string, { origin, keep, state }: GoOptions = {}) => {
      if (busy.current) return
      if (reduced) {
        navigate(to, { state })
        return
      }
      busy.current = true
      shatter(origin ?? { x: innerWidth / 2, y: innerHeight / 2 }, keep).then(() => {
        busy.current = false
        navigate(to, { state })
      })
    },
    [navigate, reduced],
  )
}
