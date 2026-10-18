// "Zero to one" on the home page (Jayanth, 2026-10-17; after neutomni.com's rolling shape,
// written from scratch): a lumpy blob, the letters' blob shape, rolls left to right along a
// bumpy road as you scroll. Its lumps and the road's bumps fade together, so it ends as a circle
// on a flat line, under the steps of the Stage Zero work (about-me.md §3). The heading is
// Jayanth's own reflection. 2D canvas; eases 20% of the way to the scroll position each frame
// and draws only while it's moving. Reduced motion: follows the scroll without easing.
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import RevealText from './RevealText'
import './RollingRoad.css'

const STEPS = ['Interviews', 'Market sizing', 'PRDs', 'Wireframes', 'Testing', 'Pilot']
const LUMPS = [1.08, 0.9, 1.12, 0.94, 1.05, 0.88, 1.1, 0.96]
const TAU = Math.PI * 2

// The blob's radius at angle t in its own frame: a smooth closed curve through the 8 lumps.
function radiusAt(t: number, r: number, rough: number) {
  const turn = ((t % TAU) + TAU) % TAU
  const f = (turn / TAU) * LUMPS.length
  const k = Math.floor(f)
  const u = f - k
  const a = LUMPS[k % LUMPS.length]
  const b = LUMPS[(k + 1) % LUMPS.length]
  const lump = a + ((b - a) * (1 - Math.cos(u * Math.PI))) / 2
  return r * (1 + (lump - 1) * rough)
}

export default function RollingRoad() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [step, setStep] = useState(-1)

  useEffect(() => {
    const sec = section.current
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!sec || !cv || !ctx) return
    const token = (name: string) => getComputedStyle(cv).getPropertyValue(name).trim()
    // Colours of the surface it sits on (white on the theme blue).
    const ink = token('--ink')
    const surface = token('--surface')
    const guide = token('--bloom-sky')
    let W = 0, H = 0, R = 0, target = 0, shown = 0, raf = 0

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.clientWidth
      H = cv.clientHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = Math.min(W, H) * 0.11
    }

    const draw = (p: number) => {
      const rough = 1 - p * p * (3 - 2 * p) // rough at the start, smooth at the end
      const groundY = H * 0.68
      const road = (x: number) =>
        groundY + Math.sin(x / (R * 0.7)) * R * 0.18 * rough + Math.sin(x / (R * 0.31)) * R * 0.06 * rough
      const x0 = -R
      const x1 = W - R * 1.5
      const cx = x0 + (x1 - x0) * p
      const angle = (cx - x0) / R
      ctx.clearRect(0, 0, W, H)

      ctx.beginPath()
      for (let x = 0; x <= W; x += 4) x ? ctx.lineTo(x, road(x)) : ctx.moveTo(x, road(x))
      ctx.strokeStyle = ink
      ctx.lineWidth = 1.5
      ctx.stroke()

      // The blob rests on its lowest point at this rotation.
      let lowest = 0
      for (let i = -6; i <= 6; i++) {
        const a = Math.PI / 2 + i * 0.08
        lowest = Math.max(lowest, radiusAt(a - angle, R, rough) * Math.sin(a))
      }
      const cy = road(cx) - lowest

      ctx.save()
      ctx.setLineDash([5, 10])
      ctx.strokeStyle = guide
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(W, cy)
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.beginPath()
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * TAU
        const rr = radiusAt(t, R, rough)
        const x = Math.cos(t + angle) * rr
        const y = Math.sin(t + angle) * rr
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = ink
      ctx.fill()
      ctx.strokeStyle = ink
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, 3, 0, TAU)
      ctx.fillStyle = surface
      ctx.fill()
      ctx.restore()

      setStep(p > 0.02 ? Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)) : -1)
    }

    const tick = () => {
      shown += (target - shown) * 0.2
      if (Math.abs(target - shown) < 0.0005) shown = target
      draw(shown)
      raf = shown === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      const r = sec.getBoundingClientRect()
      target = Math.min(1, Math.max(0, -r.top / Math.max(1, sec.offsetHeight - window.innerHeight)))
      if (reduced) {
        shown = target
        draw(shown)
      } else if (!raf) raf = requestAnimationFrame(tick)
    }
    const onResize = () => {
      size()
      draw(shown)
      onScroll()
    }
    size()
    onScroll()
    draw(shown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <section ref={section} className="road" aria-labelledby="road-title">
      <div className="road-stage">
        <canvas ref={canvas} className="road-canvas" aria-hidden="true" />
        <RevealText as="h2" id="road-title" className="display road-title" text="Zero to one was a little messy. Every day was different." />
        <ol className="road-steps mono" aria-label="What the work at Stage Zero Health covered">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= step ? 'is-on' : undefined}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
