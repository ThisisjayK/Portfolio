// A clickable letter with a pink amoeba behind it (after aiu.is). The blob is small, lumpy
// and a little off-centre, so the letter reads white only where it overlaps. On hover or focus
// it stays where it is, at the same size, and only ripples briefly before settling. The shape
// is one SVG path, drawn again as a clip for the white copy of the letter. It only animates
// while it's moving, then stops (no idle loop).
import { useEffect, useId, useMemo, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const N = 8 // points around the outline
const BOX = 100 // viewBox size
const REST_R = 22
const OPEN_R = 47 // full circle; unused while hover doesn't grow the blob

type Props = { glyph: string; active: boolean }

// Closed Catmull-Rom curve through the points, as cubic Béziers.
function outline(cx: number, cy: number, r: number, lumps: number[]) {
  const pts = lumps.map((k, i) => {
    const a = (i / N) * Math.PI * 2
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]
  })
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % N]
    const p3 = pts[(i + 2) % N]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return d + 'Z'
}

export default function BlobLetter({ glyph, active }: Props) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const path = useRef<SVGPathElement>(null)
  const clip = useRef<SVGPathElement>(null)

  // Each blob gets its own resting lumps and offset (per visit).
  const rest = useMemo(() => {
    const a = Math.random() * Math.PI * 2
    return {
      x: 50 + Math.cos(a) * 14,
      y: 50 + Math.sin(a) * 14,
      lumps: Array.from({ length: N }, () => 0.82 + Math.random() * 0.36),
    }
  }, [])

  // Spring state, kept in a ref so hover changes don't re-render.
  const s = useRef({ x: rest.x, y: rest.y, r: REST_R, vx: 0, vy: 0, vr: 0, wob: 0, t: 0 })

  const paint = () => {
    const st = s.current
    const lumps = rest.lumps.map((k, i) => {
      // Lumps fade toward a circle as the blob opens; the wobble ripples around it.
      const open = (st.r - REST_R) / (OPEN_R - REST_R)
      const base = k + (1 - k) * Math.min(1, Math.max(0, open))
      return base + st.wob * Math.sin(st.t * 9 + i * 2.1)
    })
    const d = outline(st.x, st.y, st.r, lumps)
    path.current?.setAttribute('d', d)
    clip.current?.setAttribute('d', d)
  }

  useEffect(() => {
    const st = s.current
    // It grows in place: the centre never moves, only the size and shape.
    const tx = rest.x
    const ty = rest.y
    // The blob keeps its size on hover (Jayanth, 2026-10-17); it only ripples.
    const tr = REST_R
    if (reduced) {
      Object.assign(st, { x: tx, y: ty, r: tr, vx: 0, vy: 0, vr: 0, wob: 0 })
      paint()
      return
    }
    st.wob = 0.09 // a splash of wobble on every change
    let raf = 0
    let last = performance.now()
    const k = 170 // stiffness
    const c = 16 // damping
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      st.t += dt
      st.vx += (k * (tx - st.x) - c * st.vx) * dt
      st.vy += (k * (ty - st.y) - c * st.vy) * dt
      st.vr += (k * (tr - st.r) - c * st.vr) * dt
      st.x += st.vx * dt
      st.y += st.vy * dt
      st.r += st.vr * dt
      st.wob *= Math.exp(-dt * 3.2)
      paint()
      const moving =
        Math.abs(tx - st.x) + Math.abs(ty - st.y) + Math.abs(tr - st.r) > 0.05 ||
        Math.abs(st.vx) + Math.abs(st.vy) + Math.abs(st.vr) > 0.05 ||
        st.wob > 0.002
      if (moving) raf = requestAnimationFrame(step)
      else {
        Object.assign(st, { x: tx, y: ty, r: tr, wob: 0 })
        paint()
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduced])

  const initial = outline(rest.x, rest.y, REST_R, rest.lumps)

  return (
    <svg className="blob-letter" viewBox={`0 0 ${BOX} ${BOX}`} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`blob-${id}`}>
          <path ref={clip} d={initial} />
        </clipPath>
      </defs>
      <text className="blob-ink" x="50" y="50" dy="0.35em" textAnchor="middle">{glyph}</text>
      <path ref={path} className="blob-fill" d={initial} />
      <text className="blob-knock" x="50" y="50" dy="0.35em" textAnchor="middle" clipPath={`url(#blob-${id})`}>
        {glyph}
      </text>
    </svg>
  )
}
