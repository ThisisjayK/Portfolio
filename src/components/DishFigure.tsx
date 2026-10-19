// A dish's picture with its ingredients labelled (Jayanth, 2026-10-19): each ingredient's name
// and a short note sit beside the picture, and a thin hand-drawn arrow runs from the spot on
// the plate to the label. Labels go on the side the ingredient is on and stay level with it, nudged
// apart so they never overlap. Phones (no room beside the picture): numbered dots on the
// picture and a numbered list under it. The whole figure is one data-hop element, so the
// picture, arrows and labels break apart together in the grid hop.
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Dish } from '../content/dishes'
import './DishFigure.css'

type Arrow = { d: string; head: string }

const GAP = 8 // px between stacked labels

export default function DishFigure({ dish }: { dish: Dish }) {
  const fig = useRef<HTMLElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const labels = useRef<(HTMLLIElement | null)[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [tops, setTops] = useState<number[]>([])
  const [minH, setMinH] = useState(0)
  // width / height of the picture, so tall ones (the lemonade jar) are capped by height too.
  const [ratio, setRatio] = useState(1)
  // Reading order: left side top to bottom, then right side top to bottom. The numbers follow
  // it, so they count down each column of labels.
  const items = useMemo(
    () =>
      [...(dish.ingredients ?? [])].sort((a, b) =>
        a.side === b.side ? a.at[1] - b.at[1] : a.side === 'left' ? -1 : 1,
      ),
    [dish],
  )

  const layout = useCallback(() => {
    const f = fig.current
    const im = img.current
    if (!f || !im || !im.complete || !im.naturalWidth) return
    const fr = f.getBoundingClientRect()
    const ir = im.getBoundingClientRect()
    // Phones: CSS lays the labels out as a list; no arrows.
    if (getComputedStyle(f).getPropertyValue('--figure-mode').trim() === 'list') {
      setArrows([])
      setTops([])
      setMinH(0)
      return
    }
    const pts = items.map((g) => ({
      x: ir.left - fr.left + (g.at[0] / 100) * ir.width,
      y: ir.top - fr.top + (g.at[1] / 100) * ir.height,
    }))
    // Labels level with their spot, top to bottom per side, pushed down to clear the one above,
    // then the whole side pulled back up (as a block, so nothing overlaps) if it runs past the
    // bottom of the picture. If a side still doesn't fit, the figure grows to hold it.
    const next: number[] = new Array(items.length).fill(0)
    let bottom = 0
    for (const side of ['left', 'right'] as const) {
      const idx = items.map((_, i) => i).filter((i) => items[i].side === side).sort((a, b) => pts[a].y - pts[b].y)
      let floor = 0
      for (const i of idx) {
        const h = labels.current[i]?.offsetHeight ?? 0
        const t = Math.max(floor, pts[i].y - h / 2)
        next[i] = t
        floor = t + h + GAP
      }
      const over = floor - GAP - ir.height
      const lift = idx.length ? Math.min(Math.max(0, over), next[idx[0]]) : 0
      for (const i of idx) next[i] -= lift
      bottom = Math.max(bottom, floor - GAP - lift)
    }
    setTops(next)
    setMinH(bottom > ir.height + 1 ? Math.ceil(bottom) : 0)
    // Arrows: from the spot on the plate, bowing a little, to the label, with the head
    // pointing at the text (Jayanth, 2026-10-19).
    setArrows(
      items.map((g, i) => {
        const el = labels.current[i]
        const h = el?.offsetHeight ?? 0
        const w = el?.offsetWidth ?? 0
        const left = g.side === 'left'
        const { x: sx, y: sy } = pts[i]
        // Stop 6px short of the label's inner edge, level with its first line.
        const tx = left ? w + 6 : fr.width - w - 6
        const ty = next[i] + Math.min(h / 2, 11)
        const dx = tx - sx
        const dy = ty - sy
        const len = Math.hypot(dx, dy) || 1
        // Bow perpendicular to the line by 12% of its length.
        const bow = 0.12 * len * (left ? 1 : -1)
        const cx = (sx + tx) / 2 + (-dy / len) * bow
        const cy = (sy + ty) / 2 + (dx / len) * bow
        // Arrowhead along the curve's end direction.
        const ax = tx - cx
        const ay = ty - cy
        const al = Math.hypot(ax, ay) || 1
        const ux = ax / al
        const uy = ay / al
        return {
          d: `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`,
          head: `M${tx - ux * 7 - uy * 4},${ty - uy * 7 + ux * 4} L${tx},${ty} L${tx - ux * 7 + uy * 4},${ty - uy * 7 - ux * 4}`,
        }
      }),
    )
  }, [items])

  useLayoutEffect(() => {
    layout()
    const f = fig.current
    if (!f) return
    const ro = new ResizeObserver(() => layout())
    ro.observe(f)
    if (img.current) ro.observe(img.current)
    document.fonts.ready.then(layout)
    return () => ro.disconnect()
  }, [layout])

  // Re-measure once the picture's shape is known and its box has been resized to match.
  useLayoutEffect(() => {
    layout()
  }, [ratio, layout])

  return (
    <figure ref={fig} className="dish-figure" style={minH ? { minHeight: minH } : undefined} data-hop>
      <div className="dish-figure-media" style={{ ['--ratio' as string]: ratio }}>
        <img
          ref={img}
          className="dish-figure-img"
          src={dish.img}
          alt={dish.name}
          onLoad={(e) => {
            const im = e.currentTarget
            if (im.naturalHeight) setRatio(im.naturalWidth / im.naturalHeight)
          }}
        />
        {/* Phones: numbered dots on the picture. */}
        {items.map((g, i) => (
          <span
            key={g.item}
            className="dish-figure-pin mono"
            style={{ left: `${g.at[0]}%`, top: `${g.at[1]}%` }}
            aria-hidden="true"
          >
            {i + 1}
          </span>
        ))}
      </div>
      <svg className="dish-figure-arrows" aria-hidden="true">
        {arrows.map((a, i) => (
          <g key={i} style={{ ['--i' as string]: i }}>
            <path
              className="dish-figure-line"
              d={a.d}
              ref={(el) => {
                if (el) el.style.setProperty('--len', String(el.getTotalLength()))
              }}
            />
            <path className="dish-figure-head" d={a.head} />
          </g>
        ))}
      </svg>
      <figcaption>
        <ol className="dish-figure-labels" aria-label="Ingredients">
          {items.map((g, i) => (
            <li
              key={g.item}
              ref={(el) => {
                labels.current[i] = el
              }}
              className="dish-figure-label"
              data-side={g.side}
              style={tops.length ? { top: tops[i] } : undefined}
            >
              <span className="dish-figure-num mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="dish-figure-name">{g.item}</span>
              <span className="dish-figure-note">{g.note}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  )
}
