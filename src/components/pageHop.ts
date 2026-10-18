// The page-to-page transition for the letters: a grid hop (Jayanth, 2026-10-17, after aiu.is's
// page change; replaces the vapour). The view is cut into 32px cells. Each cell briefly shows a
// nearby cell's pixels, then settles or clears at its own random moment, so the page reads as a
// mosaic that comes apart and reassembles. Calmer and more orderly than particles.
// - Everything marked data-hop that's on screen is redrawn on a temporary canvas (text glyph by
//   glyph, the letters' blobs, the roll box's front face, the close cross) and hidden.
// - hopOut(): the cells scramble and clear, spreading out from the click. The route changes
//   when it's done.
// - hopIn(): the new page's cells arrive scrambled and settle, then the real page takes over.
// The canvas lives on <body>, outside React. Reduced motion skips all of it.
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'

type Point = { x: number; y: number }

const CELL = 32 // px
const REACH = 2 // a cell borrows from up to this many cells away
const rand = (a: number, b: number) => a + Math.random() * (b - a)

// ——— Drawing the page ————————————————————————————————————————————————————————————————————————————

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

// Redraws the on-screen elements on a viewport-sized canvas at screen resolution. dy corrects
// for a page that is still sliding into place (Page.tsx lifts the page 8px as it fades in).
function raster(els: HTMLElement[], dy = 0) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const c = document.createElement('canvas')
  c.width = Math.round(innerWidth * dpr)
  c.height = Math.round(innerHeight * dpr)
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.scale(dpr, dpr)
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
      // Skip SVG text (drawn above) and screen-reader-only copies.
      if (!parent || parent.closest('svg') || parent.closest('.visually-hidden')) continue
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

  // The cells that have anything in them (empty ones are skipped while drawing).
  const cols = Math.ceil(innerWidth / CELL)
  const rows = Math.ceil(innerHeight / CELL)
  const { data } = ctx.getImageData(0, 0, c.width, c.height)
  const cells: { c: number; r: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      let ink = false
      const x0 = Math.floor(col * CELL * dpr), y0 = Math.floor(r * CELL * dpr)
      const x1 = Math.min(c.width, x0 + CELL * dpr), y1 = Math.min(c.height, y0 + CELL * dpr)
      for (let y = y0; y < y1 && !ink; y += 3) {
        for (let x = x0; x < x1; x += 3) {
          if (data[(y * c.width + x) * 4 + 3] > 16) { ink = true; break }
        }
      }
      if (ink) cells.push({ c: col, r })
    }
  }
  return { canvas: c, dpr, cols, rows, cells }
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
  ctx?.setTransform(1, 0, 0, 1, 0, 0)
  return { canvas, ctx }
}

const targetsIn = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-hop]')).filter((el) => {
    const r = el.getBoundingClientRect()
    return r.width >= 1 && r.height >= 1 && r.bottom > 0 && r.top < innerHeight
  })

type Plan = { c: number; r: number; sc: number; sr: number; scrambleAt: number; settleAt: number }

const near = (v: number, max: number) =>
  Math.min(max - 1, Math.max(0, v + Math.round(rand(-REACH, REACH))))

// Draws one frame: each cell either shows its own square, a neighbour's, or nothing.
function drawCells(
  ctx: CanvasRenderingContext2D,
  src: NonNullable<ReturnType<typeof raster>>,
  plans: Plan[],
  t: number,
  mode: 'out' | 'in',
) {
  const s = CELL * src.dpr
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (const p of plans) {
    // out: own square → neighbour's square → gone.  in: nothing → neighbour's → own square.
    let from: [number, number] | null
    if (mode === 'out') from = t < p.scrambleAt ? [p.c, p.r] : t < p.settleAt ? [p.sc, p.sr] : null
    else from = t < p.scrambleAt ? null : t < p.settleAt ? [p.sc, p.sr] : [p.c, p.r]
    if (!from) continue
    ctx.drawImage(src.canvas, from[0] * s, from[1] * s, s, s, p.c * s, p.r * s, s, s)
  }
}

// ——— Out ——————————————————————————————————————————————————————————————————————————————————

// Resolves when the page has come apart (time to change the route).
export function hopOut(origin: Point): Promise<void> {
  const els = targetsIn(document.querySelector('main') ?? document)
  const src = raster(els)
  for (const el of els) {
    el.style.transition = 'none'
    el.style.opacity = '0'
  }
  // The bloom behind the hero fades rather than breaking up.
  const backdrop = document.querySelector<HTMLElement>('main .hero-media')
  if (backdrop) {
    backdrop.style.transition = 'opacity 300ms ease-out'
    backdrop.style.opacity = '0'
  }
  const { canvas, ctx } = overlay()
  if (!ctx || !src || !src.cells.length) {
    canvas.remove()
    return Promise.resolve()
  }
  // Cells near the click go first.
  const far = Math.hypot(innerWidth, innerHeight)
  const plans: Plan[] = src.cells.map(({ c, r }) => {
    const d = Math.hypot((c + 0.5) * CELL - origin.x, (r + 0.5) * CELL - origin.y) / far
    const scrambleAt = d * 0.18 + rand(0, 0.08)
    return { c, r, sc: near(c, src.cols), sr: near(r, src.rows), scrambleAt, settleAt: scrambleAt + rand(0.06, 0.16) }
  })
  const end = Math.max(...plans.map((p) => p.settleAt))
  return new Promise((resolve) => {
    const start = performance.now()
    const frame = (now: number) => {
      const t = (now - start) / 1000
      drawCells(ctx, src, plans, t, 'out')
      if (t < end) requestAnimationFrame(frame)
      else {
        canvas.remove()
        resolve()
      }
    }
    requestAnimationFrame(frame)
  })
}

// ——— In ———————————————————————————————————————————————————————————————————————————————————

// Hide the elements now (call before paint), then let them reassemble once fonts are ready.
// Returns a cancel function for unmounts mid-way.
export function hopIn(root: HTMLElement): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-hop]'))
  for (const el of els) el.style.opacity = '0'
  let cancelled = false
  let raf = 0
  let canvas: HTMLCanvasElement | null = null
  const reveal = () => {
    for (const el of els) el.style.opacity = ''
  }

  document.fonts.ready.then(() => {
    if (cancelled) return
    // Page.tsx is still lifting the page into place; draw where it will end up.
    const main = root.closest('main')
    const lift = main ? new DOMMatrixReadOnly(getComputedStyle(main).transform).m42 : 0
    const src = raster(targetsIn(root), lift)
    const o = overlay()
    canvas = o.canvas
    const ctx = o.ctx
    if (!ctx || !src || !src.cells.length) {
      canvas.remove()
      reveal()
      return
    }
    // Top-left first, like the page being set line by line.
    const plans: Plan[] = src.cells.map(({ c, r }) => {
      const d = (c / src.cols) * 0.4 + (r / src.rows) * 0.6
      const scrambleAt = d * 0.22 + rand(0, 0.08)
      return { c, r, sc: near(c, src.cols), sr: near(r, src.rows), scrambleAt, settleAt: scrambleAt + rand(0.08, 0.2) }
    })
    const end = Math.max(...plans.map((p) => p.settleAt))
    const start = performance.now()
    const frame = (now: number) => {
      if (cancelled) return
      const t = (now - start) / 1000
      drawCells(ctx, src, plans, t, 'in')
      if (t < end) raf = requestAnimationFrame(frame)
      else {
        // The real page takes over, then the mosaic goes.
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

// Navigate through the grid hop. Reduced motion skips it (the page's own fade still runs).
export function usePageHop() {
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
      hopOut(origin ?? { x: innerWidth / 2, y: innerHeight / 2 }).then(() => {
        busy.current = false
        navigate(to, { state })
      })
    },
    [navigate, reduced],
  )
}
