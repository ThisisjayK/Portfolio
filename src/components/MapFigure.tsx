// A picture with one spot marked (Jayanth, 2026-10-19): a thin loose circle round it and a thin
// arrow between it and a label beside the picture, laid out like the dish pages' ingredient
// labels (DishFigure). The circle and arrow are plain site blue (Jayanth's request, no halo). The arrow's head is at the
// label (a place on a map) or at the target (pointing someone out). The marks draw in once, when
// the figure scrolls into view. Phones have no room beside the picture: the label sits underneath
// and the arrow is dropped; the circle stays. Reduced motion: drawn already.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './MapFigure.css'

type Props = {
  src: string
  alt: string
  width: number
  height: number
  at: [number, number]
  r: number
  circle?: string // optional: a photo can have just the arrow
  label: { num?: string; name: string; note?: string }
  headAt?: 'label' | 'target'
}

export default function MapFigure({ src, alt, width, height, at, r, circle, label, headAt = 'label' }: Props) {
  const fig = useRef<HTMLElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const lab = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  const [arrow, setArrow] = useState<{ d: string; head: string; box: [number, number, number, number]; k: number } | null>(null)
  const [labelTop, setLabelTop] = useState<number | null>(null)

  const layout = useCallback(() => {
    const f = fig.current
    const im = img.current
    const lb = lab.current
    if (!f || !im || !lb) return
    if (getComputedStyle(f).getPropertyValue('--figure-mode').trim() === 'list') {
      setArrow(null)
      return
    }
    const fr = f.getBoundingClientRect()
    const ir = im.getBoundingClientRect()
    const k = width / ir.width // picture units per screen px
    const x0 = ir.left - fr.left
    const y0 = ir.top - fr.top
    // The label sits level with the target (its first line on the target's height).
    const top = y0 + (at[1] / height) * ir.height - 12
    setLabelTop(top)
    const lr = lb.getBoundingClientRect()
    // The arrow runs between the circle's right edge and the label's first line.
    const sx = x0 + ((at[0] + r) / width) * ir.width
    const sy = y0 + (at[1] / height) * ir.height
    const tx = lr.left - fr.left - 8
    const ty = top + 12
    const dx = tx - sx
    const dy = ty - sy
    const len = Math.hypot(dx, dy) || 1
    const bow = -0.14 * len
    const cx = (sx + tx) / 2 + (-dy / len) * bow
    const cy = (sy + ty) / 2 + (dx / len) * bow
    const toTarget = headAt === 'target'
    // Path direction follows the head: the head is always at the path's end.
    const [ax0, ay0, ax1, ay1] = toTarget ? [tx, ty, sx, sy] : [sx, sy, tx, ty]
    const ex = ax1 - cx
    const ey = ay1 - cy
    const el = Math.hypot(ex, ey) || 1
    const ux = ex / el
    const uy = ey / el
    setArrow({
      d: `M${ax0},${ay0} Q${cx},${cy} ${ax1},${ay1}`,
      head: `M${ax1 - ux * 8 - uy * 4.5},${ay1 - uy * 8 + ux * 4.5} L${ax1},${ay1} L${ax1 - ux * 8 + uy * 4.5},${ay1 - uy * 8 - ux * 4.5}`,
      box: [x0, y0, ir.width, ir.height],
      k,
    })
  }, [at, r, width, height, headAt])

  useLayoutEffect(() => {
    layout()
    const f = fig.current
    if (!f) return
    const ro = new ResizeObserver(() => layout())
    ro.observe(f)
    if (img.current) ro.observe(img.current)
    return () => ro.disconnect()
  }, [layout])

  useEffect(() => {
    const el = media.current // the picture itself: the wide figure is clipped by its scroller
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const k = arrow?.k ?? width / 480
  return (
    <figure ref={fig} className="mapfig" data-seen={seen ? '' : undefined} data-hop>
      <div ref={media} className="mapfig-media">
        <img ref={img} src={src} alt={alt} width={width} height={height} onLoad={layout} />
        <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          {circle && <path className="mapfig-line mapfig-circle" d={circle} pathLength={1} style={{ strokeWidth: 1.4 * k }} />}
        </svg>
      </div>

      {arrow && (
        <svg className="mapfig-arrow" aria-hidden="true">
          <path className="mapfig-line mapfig-blue mapfig-stem" d={arrow.d} pathLength={1} />
          <path className="mapfig-line mapfig-blue mapfig-head" d={arrow.head} pathLength={1} />
        </svg>
      )}

      <figcaption ref={lab} className="mapfig-label" style={labelTop !== null ? { top: labelTop } : undefined}>
        {label.num && (
          <span className="mapfig-num mono" aria-hidden="true">
            {label.num}
          </span>
        )}
        <span className="mapfig-name">{label.name}</span>
        {label.note && <span className="mapfig-note">{label.note}</span>}
      </figcaption>
    </figure>
  )
}
