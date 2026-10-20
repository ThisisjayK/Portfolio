import type { ReactNode } from 'react'
import * as m from 'motion/react-m'

// Page transition: the grid hop (pageHop.ts) does the visible work, so the page itself only
// fades in and leaves at once (Jayanth, 2026-10-18). The old 250ms exit fade left a blank gap
// after the hop, and the 8px lift made the new text drift up as it appeared. No lift now.
export default function Page({ children }: { children: ReactNode }) {
  return (
    <m.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
    >
      {children}
    </m.main>
  )
}
