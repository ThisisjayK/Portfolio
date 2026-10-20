// "The road so far" on the home page (Jayanth, 2026-10-17; after neutomni.com's rolling shape,
// written from scratch): a lumpy blob, the letters' blob shape, rolls left to right along a
// bumpy road as you scroll. Its lumps and the road's bumps fade together, so it ends as a circle
// on a flat line, under Jayanth's work timeline, oldest first (about.ts `timeline`, from
// about-me.md §3; was the steps of the Stage Zero work until 2026-10-19). 2D canvas; eases 20% of the way to the scroll position each frame
// and draws only while it's moving. Reduced motion: follows the scroll without easing.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAnimate, useReducedMotion } from 'motion/react'
import RevealText from './RevealText'
import { timeline } from '../content/about'
import './RollingRoad.css'

const STEPS = timeline
const HOP_ROOM = 40 // px above the list for the hopper (24px, plus its gap and its arc's start)
const LUMPS = [1.08, 0.9, 1.12, 0.94, 1.05, 0.88, 1.1, 0.96]
const TAU = Math.PI * 2

// A lumpy closed blob (8 points, smooth Catmull-Rom curve) in a 24×24 box, for the hopper.
// Every call gives new lumps; the path always has the same commands, so it can morph.
function amoeba() {
  const n = 8
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * TAU
    const r = 9 * (0.82 + Math.random() * 0.36)
    return [12 + Math.cos(a) * r, 12 + Math.sin(a) * r]
  })
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return d + 'Z'
}
const FIRST_AMOEBA = amoeba()

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
  const steps = useRef<HTMLOListElement>(null)
  const [hopper, animateHop] = useAnimate<HTMLSpanElement>()
  const landed = useRef<number>(-1)

  // A small, slimy amoeba floats centred above the steps and hops onto each new step the big
  // blob reaches (Jayanth, 2026-10-17): it stretches tall as it leaves, squashes wide as it
  // lands, wobbles back, and its lumps reshape in flight. Still between hops; reduced motion
  // moves it without the arc, squash or reshaping.
  // A blink: the eyes close and open in ~160ms.
  const blink = () => {
    const el = hopper.current
    if (!el || reduced) return
    el.classList.remove('is-blinking')
    void el.offsetWidth
    el.classList.add('is-blinking')
  }

  // It also blinks now and then on its own, at random 2–6s gaps, but only while the section is on
  // screen and the tab is visible. Reduced motion: no blinking. (A deliberate exception to the
  // no-ambient-motion rule, design-system.md §6.)
  useEffect(() => {
    const sec = section.current
    if (!sec || reduced) return
    let timer = 0
    let onScreen = false
    const next = () => {
      timer = window.setTimeout(() => {
        if (onScreen && !document.hidden) blink()
        next()
      }, 2000 + Math.random() * 4000)
    }
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting))
    io.observe(sec)
    next()
    return () => {
      clearTimeout(timer)
      io.disconnect()
    }
  }, [reduced])

  useLayoutEffect(() => {
    const list = steps.current
    const el = hopper.current
    const path = el?.querySelector('path')
    if (!list || !el || !path) return
    const place = (to: number, jump: boolean) => {
      const li = list.children[Math.max(0, to)] as HTMLElement | undefined
      if (!li) return
      // Centred over the step's label, relative to the steps' wrapper.
      const x = li.offsetLeft + li.offsetWidth / 2 - el.offsetWidth / 2
      const shown = to >= 0 ? 1 : 0
      if (!jump || reduced) {
        animateHop(el, { x, y: 0, opacity: shown }, { duration: reduced ? 0 : 0.2 })
        return
      }
      const ease = [0.22, 1, 0.36, 1] as const
      // Arc, with squash and stretch: tall on take-off, wide on landing, a small wobble back.
      animateHop(
        el,
        { x, y: [0, -30, 0, 0, 0], scaleX: [1, 0.8, 1.3, 0.92, 1], scaleY: [1, 1.25, 0.72, 1.08, 1], opacity: shown },
        { duration: 0.6, times: [0, 0.35, 0.62, 0.82, 1], ease },
      )
      // New lumps, morphed by a CSS transition on `d` (Chrome, Firefox; Safari just swaps them).
      path.style.setProperty('d', `path("${amoeba()}")`)
    }
    if (landed.current >= 0 && step >= 0 && step !== landed.current) blink()
    place(step, landed.current >= 0 && step >= 0 && step !== landed.current)
    landed.current = step
    const onResize = () => place(landed.current, false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [step, reduced, animateHop, hopper])

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
      // At 68% of the screen, or higher when the roles wrap into several rows (phones), so the
      // road and the hopper above the list never overlap it. The wrap sits in the stage.
      const wrap = steps.current?.parentElement
      const clear = wrap ? wrap.offsetTop - HOP_ROOM - R * 0.3 : H
      const groundY = Math.min(H * 0.68, clear)
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
        <RevealText as="h2" id="road-title" className="display road-title" text="The road so far." />
        <div className="road-steps-wrap">
        <ol ref={steps} className="road-steps" aria-label="Where Jayanth has worked, oldest first">
          {STEPS.map((s) => (
            <li key={s.when}>
              <span className="road-when mono">{s.when}</span>
              <span className="road-role">{s.role}</span>
              <span className="road-org mono">{s.org}</span>
            </li>
          ))}
        </ol>
          {/* Decorative, so it sits beside the list, not in it. */}
          <span ref={hopper} className="road-hopper" aria-hidden="true">
            <svg viewBox="0 0 24 24" overflow="visible">
              <path d={FIRST_AMOEBA} />
              {/* Three eyes that blink (Jayanth, 2026-10-17). */}
              <g className="road-hopper-eyes">
                <circle cx="7.6" cy="10.4" r="1.6" />
                <circle cx="12" cy="8.6" r="1.8" />
                <circle cx="16.4" cy="10.4" r="1.6" />
              </g>
            </svg>
          </span>
        </div>
      </div>
    </section>
  )
}
