import type { ReactNode } from 'react'
import * as m from 'motion/react-m'

// Calm page transition: a short fade and a small lift. Only opacity and transform animate.
export default function Page({ children }: { children: ReactNode }) {
  return (
    <m.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.main>
  )
}
