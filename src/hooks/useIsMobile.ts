import { useEffect, useState } from "react"

const QUERY = "(max-width:900px)"

// Shared with App.tsx's mobile-only layout switch (rail nav -> hamburger,
// motion chrome -> instant, pixel-art decorations -> hidden). 900px matches
// the breakpoint every other responsive rule in the site already uses.
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(
    () => window.matchMedia(QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setMobile(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return mobile
}
