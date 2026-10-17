// The page-to-page transition for the letters (Jayanth, 2026-10-17, in the spirit of React Bits
// Pro's "Vapor Type", written here from scratch): text turns into vapour and drifts away, and the
// next page's text condenses back out of it.
// - Everything marked data-vapor is redrawn on a temporary canvas, sampled into fine dots taken
//   from the real letter shapes (and the blobs behind the clickable letters), and hidden.
// - vaporize(): the dots let go in a sweep out from the click and drift up and away, wobbling
//   and fading. The route changes as soon as the sweep has passed, so the vapour is still
//   drifting while the next page arrives.
// - condense(): the new page's dots gather in from a loose cloud, left to right, then the real
//   text takes over.
// The canvas lives on <body>, outside React, so it survives the route change. The roll box is
// never marked, so it stays still as the anchor. Reduced motion skips all of it.
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'

type Point = { x: number; y: number }
type Dot = { x: number; y: number; color: string }

const SWEEP = 1800 // px/s: how fast the release travels out from the click
const MAX_DOTS = 14000
const rand = (a: number, b: number) => a + Math.random() * (b - a)

// ——— Sampling ————————————————————————————————————————————————————————————————————————————

function fontOf(cs: CSSStyleDeclaration) {
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
}

// Draws one character so it lands where the browser drew it (rect from a DOM Range).
function drawChar(ctx: CanvasRenderingContext2D, ch: string, rect: DOMRect, dy: number) {
  const m = ctx.measureText(ch)
  const asc = m.fontBoundingBoxAscent || m.actualBoundingBoxAscent
  const desc = m.fontBoundingBoxDescent || m.actualBoundingBoxDescent
  const y = rect.top + (rect.height - (asc + desc)) / 2 + asc - dy
  ctx.fillText(ch, rect.left, y)
}

// Other drawn marks (the close cross): each path stroked or filled in screen space.
function drawPaths(ctx: CanvasRenderingContext2D, svg: SVGSVGElement, dy: number) {
  for (const path of Array.from(svg.querySelectorAll<SVGPathElement>('path'))) {
    const m = path.getScreenCTM()
    const d = path.getAttribute('d')
    if (!m || !d) continue
    const cs = getComputedStyle(path)
    const shape = new Path2D(d)
    ctx.save()
    ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f - dy)
    if (cs.fill !== 'none') {
      ctx.fillStyle = cs.fill
      ctx.fill(shape)
    }
    if (cs.stroke !== 'none') {
      ctx.strokeStyle = cs.stroke
      // Strokes are non-scaling (vector-effect), so undo the transform's scale.
      const nonScaling = cs.getPropertyValue('vector-effect') === 'non-scaling-stroke'
      ctx.lineWidth = parseFloat(cs.strokeWidth) / (nonScaling ? Math.hypot(m.a, m.b) : 1)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke(shape)
    }
    ctx.restore()
  }
}

// The letters' blobs (BlobLetter), drawn the way the SVG stacks them: the ink letter, the blob
// over it, then the letter cut out of the blob (it reads white there, so it becomes a gap).
function drawSvg(ctx: CanvasRenderingContext2D, svg: SVGSVGElement, dy: number) {
  const ink = svg.querySelector<SVGTextElement>('text.blob-ink')
  const blob = svg.querySelector<SVGPathElement>('path.blob-fill')
  const letter = (mode: GlobalCompositeOperation) => {
    if (!ink?.textContent) return
    const cs = getComputedStyle(ink)
    const r = ink.getBoundingClientRect()
    // The SVG's font size is in viewBox units; scale it to the screen.
    const scale = ink.getScreenCTM()?.a ?? 1
    ctx.globalCompositeOperation = mode
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * scale}px ${cs.fontFamily}`
    ctx.fillStyle = cs.fill
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(ink.textContent, r.left + r.width / 2, r.top + r.height / 2 - dy)
    ctx.textAlign = 'start'
    ctx.textBaseline = 'alphabetic'
    ctx.globalCompositeOperation = 'source-over'
  }
  letter('source-over')
  const m = blob?.getScreenCTM()
  const d = blob?.getAttribute('d')
  if (!blob || !m || !d) return
  const shape = new Path2D(d)
  ctx.save()
  ctx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f - dy)
  ctx.fillStyle = getComputedStyle(blob).fill
  ctx.fill(shape)
  ctx.clip(shape)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  letter('destination-out')
  ctx.restore()
}

// Redraws the elements on an offscreen canvas and samples it into dots. dy corrects for a
// page that is still sliding into place (Page.tsx lifts the page 8px as it fades in).
function sample(els: HTMLElement[], dy = 0): Dot[] {
  const c = document.createElement('canvas')
  c.width = innerWidth
  c.height = innerHeight
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  const range = document.createRange()

  for (const el of els) {
    // Images: the roll box shows only its front face (the others are turned away).
    const imgs = el instanceof HTMLImageElement ? [el] : Array.from(el.querySelectorAll('img'))
    for (const img of imgs) {
      if (img.closest('.roll-face') && !img.closest('[data-front]')) continue
      const r = img.getBoundingClientRect()
      if (img.complete && r.width) ctx.drawImage(img, r.left, r.top - dy, r.width, r.height)
    }
    for (const svg of Array.from(el.querySelectorAll('svg'))) {
      if (svg.querySelector('path.blob-fill')) drawSvg(ctx, svg, dy)
      else drawPaths(ctx, svg, dy)
    }
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    for (let node = walk.nextNode(); node; node = walk.nextNode()) {
      const parent = node.parentElement
      if (!parent || parent.closest('svg')) continue
      const text = node.textContent ?? ''
      const cs = getComputedStyle(parent)
      ctx.font = fontOf(cs)
      ctx.fillStyle = cs.color
      const upper = cs.textTransform === 'uppercase'
      for (let i = 0; i < text.length; i++) {
        const ch = upper ? text[i].toUpperCase() : text[i]
        if (!ch.trim()) continue
        range.setStart(node, i)
        range.setEnd(node, i + 1)
        const rect = range.getBoundingClientRect()
        if (rect.width && rect.bottom > 0 && rect.top < innerHeight) drawChar(ctx, ch, rect, dy)
      }
    }
  }

  const { data } = ctx.getImageData(0, 0, c.width, c.height)
  let filled = 0
  for (let i = 3; i < data.length; i += 16) if (data[i] > 128) filled++
  // Every 2nd pixel reads as solid text; coarser only if the page has a lot of it.
  const step = Math.max(2, Math.ceil(Math.sqrt((filled * 4) / MAX_DOTS)))
  const dots: Dot[] = []
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      const i = (y * c.width + x) * 4
      if (data[i + 3] < 128) continue
      // Quantised so the draw loop changes fillStyle rarely.
      const q = (v: number) => Math.round(v / 16) * 16
      dots.push({ x, y, color: `rgb(${q(data[i])},${q(data[i + 1])},${q(data[i + 2])})` })
    }
  }
  dots.sort((a, b) => (a.color < b.color ? -1 : 1))
  return dots
}

function overlay() {
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
  ctx?.scale(dpr, dpr)
  return { canvas, ctx }
}

const targetsIn = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-vapor]')).filter((el) => {
    const r = el.getBoundingClientRect()
    return r.width >= 1 && r.height >= 1 && r.bottom > 0 && r.top < innerHeight
  })

// ——— Out ——————————————————————————————————————————————————————————————————————————————————

// Resolves once the sweep has released every dot (time to change the route); the drift keeps
// going on its own and the canvas removes itself when it's done.
export function vaporize(origin: Point): Promise<void> {
  const els = targetsIn(document.querySelector('main') ?? document)
  const dots = sample(els)
  const { canvas, ctx } = overlay()
  for (const el of els) {
    el.style.transition = 'none'
    el.style.opacity = '0'
  }
  // The bloom behind the hero fades rather than vaporising.
  const backdrop = document.querySelector<HTMLElement>('main .hero-media')
  if (backdrop) {
    backdrop.style.transition = 'opacity 400ms ease-out'
    backdrop.style.opacity = '0'
  }
  if (!ctx || !dots.length) {
    canvas.remove()
    return Promise.resolve()
  }

  const parts = dots.map((d) => {
    const dx = d.x - origin.x
    const dy = d.y - origin.y
    const dist = Math.hypot(dx, dy) || 1
    return {
      ...d,
      delay: dist / SWEEP + rand(0, 0.08),
      life: rand(0.55, 0.9),
      // Mostly up and away from the click, with a light breeze to the right.
      vx: (dx / dist) * rand(10, 50) + rand(10, 50),
      vy: (dy / dist) * rand(5, 25) - rand(20, 60),
      lift: rand(80, 200),
      wobble: rand(4, 14),
      phase: rand(0, Math.PI * 2),
      size: Math.random() < 0.7 ? 2 : 1.5,
    }
  })
  const released = Math.max(...parts.map((p) => p.delay))
  const end = Math.max(...parts.map((p) => p.delay + p.life))

  return new Promise((resolve) => {
    const start = performance.now()
    let handedOff = false
    const frame = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      let fill = ''
      for (const p of parts) {
        const s = t - p.delay
        let x = p.x
        let y = p.y
        let a = 1
        if (s > 0) {
          const k = s / p.life
          if (k >= 1) continue
          x += p.vx * s + Math.sin(p.phase + s * 7) * p.wobble * k
          y += p.vy * s - 0.5 * p.lift * s * s
          a = 1 - k ** 1.4
        }
        if (p.color !== fill) ctx.fillStyle = fill = p.color
        ctx.globalAlpha = a
        ctx.fillRect(x, y, p.size, p.size)
      }
      if (!handedOff && t >= released) {
        handedOff = true
        resolve()
      }
      if (t < end) requestAnimationFrame(frame)
      else canvas.remove()
    }
    requestAnimationFrame(frame)
  })
}

// ——— In ———————————————————————————————————————————————————————————————————————————————————

// Hide the elements now (call before paint), then condense them in once fonts are ready.
// Returns a cancel function for unmounts mid-way.
export function condense(root: HTMLElement): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-vapor]'))
  for (const el of els) el.style.opacity = '0'
  let cancelled = false
  let raf = 0
  let canvas: HTMLCanvasElement | null = null
  const reveal = () => {
    for (const el of els) el.style.opacity = ''
  }

  document.fonts.ready.then(() => {
    if (cancelled) return
    // Page.tsx is still lifting the page into place; sample where the text will end up.
    const main = root.closest('main')
    const lift = main ? new DOMMatrixReadOnly(getComputedStyle(main).transform).m42 : 0
    const dots = sample(els, lift)
    const o = overlay()
    canvas = o.canvas
    const ctx = o.ctx
    if (!ctx || !dots.length) {
      canvas.remove()
      reveal()
      return
    }
    const minX = Math.min(...dots.map((d) => d.x))
    const maxX = Math.max(...dots.map((d) => d.x))
    const parts = dots.map((d) => ({
      ...d,
      // Left to right, like the text is being written out of the cloud.
      delay: ((d.x - minX) / Math.max(1, maxX - minX)) * 0.35 + rand(0, 0.1),
      dur: rand(0.45, 0.7),
      fx: rand(-60, 20),
      fy: rand(10, 70),
      size: Math.random() < 0.7 ? 2 : 1.5,
    }))
    const end = Math.max(...parts.map((p) => p.delay + p.dur))
    const ease = (k: number) => 1 - (1 - k) ** 3

    const start = performance.now()
    const frame = (now: number) => {
      if (cancelled) return
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      let fill = ''
      for (const p of parts) {
        const k = Math.min(1, Math.max(0, (t - p.delay) / p.dur))
        if (k <= 0) continue
        const e = ease(k)
        if (p.color !== fill) ctx.fillStyle = fill = p.color
        ctx.globalAlpha = Math.min(1, k * 1.6)
        ctx.fillRect(p.x + p.fx * (1 - e), p.y + p.fy * (1 - e), p.size, p.size)
      }
      if (t < end) raf = requestAnimationFrame(frame)
      else {
        // The real text takes over, then the dots go.
        reveal()
        requestAnimationFrame(() => canvas?.remove())
      }
    }
    raf = requestAnimationFrame(frame)
  })

  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    canvas?.remove()
    reveal()
  }
}

// ——— Navigation ———————————————————————————————————————————————————————————————————————————

// Navigate through the vapour. Reduced motion skips it (the page's own fade still runs).
export function useVaporNavigate() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const busy = useRef(false)
  return useCallback(
    (to: string, { origin, state }: { origin?: Point; state?: unknown } = {}) => {
      if (busy.current) return
      if (reduced) {
        navigate(to, { state })
        return
      }
      busy.current = true
      vaporize(origin ?? { x: innerWidth / 2, y: innerHeight / 2 }).then(() => {
        busy.current = false
        navigate(to, { state })
      })
    },
    [navigate, reduced],
  )
}
