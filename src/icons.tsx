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

export function IconUser() {
  return (
    <svg {...base} strokeWidth={1.6}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  )
}

export function IconFile() {
  return (
    <svg {...base} strokeWidth={1.6}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  )
}

export function IconSearch() {
  return (
    <svg {...base} strokeWidth={1.6}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
    </svg>
  )
}

export function IconMail() {
  return (
    <svg {...base} strokeWidth={1.6}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </svg>
  )
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
