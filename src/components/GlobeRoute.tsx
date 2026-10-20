// "Where I'm from" on the home page (Jayanth, 2026-10-19): a white outline globe on the blue
// that turns as you scroll, drawing the route Hyderabad → Boston → Atlanta along great circles,
// the view following the head of the line. The caption that said it in words is hidden from
// view at Jayanth's request (2026-10-19); screen readers still get it.
// 2D canvas with d3-geo's orthographic projection; land outlines from world-atlas (110m), loaded
// only when the section is near. Eases 20% of the way to the scroll position each frame and
// draws only while it's moving, like RollingRoad. Reduced motion: the finished route, still.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo'
import type { GeoPermissibleObjects } from 'd3-geo'
import { intro } from '../content/about'
import './GlobeRoute.css'

type City = { name: string; at: [number, number] } // [longitude, latitude]
// City centres, rounded (public coordinates; Jayanth's route from about-me.md / the About me page).
const CITIES: City[] = [
  { name: 'Hyderabad', at: [78.49, 17.39] },
  { name: 'Boston', at: [-71.06, 42.36] },
  { name: 'Atlanta', at: [-84.39, 33.75] },
]
// Scroll budget: hold on Hyderabad, fly to Boston, fly to Atlanta, hold.
const LEGS = [
  [0.12, 0.62],
  [0.66, 0.86],
] as const
const FADE = 0.06 // of the section's scroll: the globe fades in over this much once pinned
const TILT = 12 // degrees: the view looks slightly down on the route, so the north reads as up

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
const legProgress = (p: number, [a, b]: readonly [number, number]) => ease((p - a) / (b - a))

export default function GlobeRoute() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const sec = section.current
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!sec || !cv || !ctx) return
    const token = (name: string) => getComputedStyle(cv).getPropertyValue(name).trim()
    const ink = token('--ink')
    // City labels in the caption's own type (.mono), so they follow the tokens.
    const caption = sec.querySelector('.globe-caption')
    const labelFont = caption ? `${getComputedStyle(caption).fontSize} ${getComputedStyle(caption).fontFamily}` : '13px monospace'
    const legs = [geoInterpolate(CITIES[0].at, CITIES[1].at), geoInterpolate(CITIES[1].at, CITIES[2].at)]
    const projection = geoOrthographic().clipAngle(90).precision(0.5)
    const path = geoPath(projection, ctx)
    const graticule = geoGraticule10()
    let land: GeoPermissibleObjects | null = null
    let W = 0, H = 0, target = 0, shown = 0, raf = 0, alive = true

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cv.clientWidth
      H = cv.clientHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const r = Math.min(W, H) * 0.42
      projection.scale(r).translate([W / 2, H / 2])
    }

    // The route as far as progress p: the finished legs plus the part of the current one.
    const routeAt = (p: number) => {
      const a = legProgress(p, LEGS[0])
      const b = legProgress(p, LEGS[1])
      const steps = (f: (t: number) => [number, number], to: number): [number, number][] => {
        const n = Math.max(2, Math.ceil(to * 64))
        return Array.from({ length: n }, (_, i) => f((i / (n - 1)) * to))
      }
      const lines: [number, number][][] = []
      if (a > 0) lines.push(steps(legs[0], a))
      if (b > 0) lines.push(steps(legs[1], b))
      // Where the line's head is, which the view follows.
      const head = b > 0 ? legs[1](b) : legs[0](a)
      return { lines, head, reached: b >= 1 ? 3 : a >= 1 ? 2 : 1 }
    }

    const draw = (p: number) => {
      const { lines, head, reached } = routeAt(p)
      projection.rotate([-head[0], -head[1] + TILT, 0])
      ctx.clearRect(0, 0, W, H)
      ctx.strokeStyle = ink
      ctx.fillStyle = ink

      ctx.globalAlpha = 0.18
      ctx.lineWidth = 1
      ctx.beginPath()
      path(graticule)
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.lineWidth = 1.5
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.stroke()

      if (land) {
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        path(land)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      if (lines.length) {
        ctx.lineWidth = 1.5 // thinned from 2.5 (Jayanth, 2026-10-19)
        ctx.lineCap = 'round'
        ctx.beginPath()
        path({ type: 'MultiLineString', coordinates: lines })
        ctx.stroke()
      }

      // Cities reached so far, on the near side only.
      const centre: [number, number] = [head[0], head[1] - TILT]
      ctx.font = labelFont
      ctx.textBaseline = 'middle'
      CITIES.slice(0, reached).forEach((c) => {
        if (geoDistance(c.at, centre) > Math.PI / 2 - 0.05) return
        const xy = projection(c.at)
        if (!xy) return
        ctx.beginPath()
        ctx.arc(xy[0], xy[1], 4, 0, Math.PI * 2)
        ctx.fill()
        // Label to the right of the dot, or to the left when it would run off the screen.
        const label = c.name.toUpperCase()
        const room = W - xy[0] - 10 > ctx.measureText(label).width + 8
        ctx.textAlign = room ? 'left' : 'right'
        ctx.fillText(label, xy[0] + (room ? 10 : -10), xy[1])
      })
    }

    const tick = () => {
      shown += (target - shown) * 0.2
      if (Math.abs(target - shown) < 0.0005) shown = target
      draw(shown)
      raf = shown === target ? 0 : requestAnimationFrame(tick)
    }
    const onScroll = () => {
      if (reduced) return
      const r = sec.getBoundingClientRect()
      // The section overlaps the hero's last screen (margin-top: -100svh in GlobeRoute.css), so
      // there's no empty blue between them. It stays hidden while it rises over the hero and
      // shows once it's pinned, exactly over the hero's flat blue; then the globe fades in.
      if (stage.current) stage.current.style.visibility = r.top > 1 ? 'hidden' : 'visible'
      target = Math.min(1, Math.max(0, -r.top / Math.max(1, sec.offsetHeight - window.innerHeight)))
      cv.style.opacity = Math.min(1, target / FADE).toFixed(3)
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onResize = () => {
      size()
      draw(shown)
    }

    // Land outlines load once the section is within a screen of view.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || land) return
        io.disconnect()
        Promise.all([import('topojson-client'), import('world-atlas/land-110m.json')]).then(([topo, atlas]) => {
          if (!alive) return
          const t = (atlas.default ?? atlas) as unknown as Parameters<typeof topo.feature>[0]
          land = topo.feature(t, t.objects.land) as GeoPermissibleObjects
          draw(shown)
        })
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(sec)

    if (reduced) shown = target = 1
    size()
    onScroll()
    draw(shown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      alive = false
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <section ref={section} className={reduced ? 'globe globe--static' : 'globe'} aria-labelledby="globe-title">
      <div ref={stage} className="globe-stage">
        <canvas ref={canvas} className="globe-canvas" aria-hidden="true" />
        {/* Caption hidden from view (Jayanth, 2026-10-19); kept for screen readers and search. */}
        <h2 id="globe-title" className="globe-caption mono visually-hidden">
          {intro.headline}
        </h2>
      </div>
    </section>
  )
}
