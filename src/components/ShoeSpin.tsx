// A product shot that turns through its angles (Jayanth, 2026-10-19, the Nocta shoes): four
// photos of the shoe from different sides, blended into each other on a slow loop with a soft
// shadow. It stays level: no bobbing. They are separate photos, not a 3D
// model, so it fades between views rather than truly rotating. Drag sideways, press the arrow
// keys or tap a number to turn it yourself; auto-play pauses under the pointer. Reduced motion:
// no auto-play and no blending.
import { useEffect, useRef, useState } from 'react'
import './ShoeSpin.css'

const AUTO_MS = 2600

export default function ShoeSpin({ frames, alt }: { frames: string[]; alt: string }) {
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const drag = useRef<{ x: number; i: number } | null>(null)
  const n = frames.length

  useEffect(() => {
    if (hover || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % n), AUTO_MS)
    return () => clearInterval(t)
  }, [hover, n])

  const go = (v: number) => setI(((v % n) + n) % n)

  return (
    <div
      className="shoespin"
      role="group"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false)
        drag.current = null
      }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, i }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!drag.current) return
        // Every 90px of drag moves one view.
        go(drag.current.i - Math.round((e.clientX - drag.current.x) / 90))
      }}
      onPointerUp={() => (drag.current = null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1)
        if (e.key === 'ArrowLeft') go(i - 1)
      }}
    >
      <div className="shoespin-float">
        <div className="shoespin-stage">
          {frames.map((src, k) => (
            <img key={src} className="shoespin-frame" data-on={k === i ? '' : undefined} src={src} alt={k === i ? `${alt}, view ${k + 1} of ${n}` : ''} aria-hidden={k !== i} draggable={false} />
          ))}
        </div>
      </div>
      <div className="shoespin-shadow" aria-hidden="true" />
      <div className="shoespin-dots">
        {frames.map((_, k) => (
          <button key={k} type="button" className="shoespin-dot mono" aria-label={`View ${k + 1}`} aria-current={k === i ? 'true' : undefined} onClick={() => go(k)}>
            {String(k + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
    </div>
  )
}
