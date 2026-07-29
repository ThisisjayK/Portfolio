/* Inline SVG icons. We deliberately avoid an icon library here: importing from
   lucide-react's barrel makes the production Rollup build pull in its entire
   icon set before tree-shaking, which stalls `vite build`. These few glyphs
   keep the build instant and the bundle tiny. Sizing is controlled by CSS
   (.glyph svg / .theme-btn svg), so the width/height attrs are just fallbacks. */
import type { SVGProps } from "react"

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

export function IconSun() {
  return (
    <svg {...base} strokeWidth={1.7}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 1.6v2.4M12 20v2.4M3.5 3.5l1.7 1.7M18.8 18.8l1.7 1.7M1.6 12h2.4M20 12h2.4M3.5 20.5l1.7-1.7M18.8 5.2l1.7-1.7" />
    </svg>
  )
}

export function IconMoon() {
  return (
    <svg {...base} strokeWidth={1.7}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export function IconMenu() {
  return (
    <svg {...base} strokeWidth={1.9}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </svg>
  )
}

export function IconClose() {
  return (
    <svg {...base} strokeWidth={1.9}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}
