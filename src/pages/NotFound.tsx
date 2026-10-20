// The 404 page, "Lost at sea" (Jayanth, 2026-10-19): on the white like the landing screen, the
// hero's cobalt drop bobs on contour ripples (the bloom's powder ripples), with one light line
// (buttons removed at Jayanth's request, 2026-10-19). Shapes use BlueBloom's lumpy outline, r·(1 + .13 sin(3t+k) + .07 sin(5t+2k)).
// Reduced motion: everything still.
import './NotFound.css'

const lumpy = (cx: number, cy: number, r: number, k: number) => {
  let d = ''
  for (let i = 0; i <= 96; i++) {
    const t = (i / 96) * Math.PI * 2
    const rr = r * (1 + 0.13 * Math.sin(3 * t + k) + 0.07 * Math.sin(5 * t + 2 * k))
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(t) * rr).toFixed(1)} ${(cy - Math.sin(t) * rr).toFixed(1)}`
  }
  return d + 'Z'
}

// Seven nested ripples, each turned a little against the last (as in the hero's powder layer).
const RIPPLES = Array.from({ length: 7 }, (_, j) => lumpy(300, 300, 280 * (1 - j * 0.13), 2.3 + j * 0.15))
const DROP = lumpy(60, 60, 40, 5.6)

export default function NotFound() {
  return (
    <section className="nf" aria-labelledby="nf-title">
      <div className="nf-text">
        <div className="nf-sea" aria-hidden="true">
          <svg className="nf-ripples" viewBox="0 0 600 600">
            {RIPPLES.map((d, j) => (
              <path key={j} d={d} style={{ animationDelay: `${(RIPPLES.length - 1 - j) * 0.5}s` }} />
            ))}
          </svg>
          <svg className="nf-drop" viewBox="0 0 125 125">
            <path className="nf-drop-shadow" d={DROP} transform="translate(5 4)" />
            <path className="nf-drop-body" d={DROP} />
          </svg>
        </div>
        <p className="nf-code mono" data-hop>
          404
        </p>
        <h1 id="nf-title" className="nf-title" data-hop>
          This page is lost at sea.
        </h1>
        <p className="nf-sub" data-hop>
          It may have moved, or it never made it to shore.
        </p>
      </div>
    </section>
  )
}
