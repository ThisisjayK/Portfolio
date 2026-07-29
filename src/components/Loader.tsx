import { useCallback, useEffect, useRef, useState } from "react"
// @ts-expect-error - JS component (React Bits), no type declaration
import RotatingText from "./RotatingText"
import "./Loader.css"

/* The boot intro. Cycles the word "perseverance" through seven languages while a
   counter runs 0 -> 100, then fades to reveal the site. Order is fixed: Telugu,
   Spanish, Hindi, Japanese, French, Chinese, then English. Non-Latin scripts
   fall through the font stack to their Noto face (subset-loaded in index.html);
   the Latin words use the bold Saint Regus cut. */
const WORDS = [
  "పట్టుదల", // Telugu
  "Perseverancia", // Spanish
  "दृढ़ता", // Hindi
  "忍耐力", // Japanese
  "Persévérance", // French
  "毅力", // Chinese
  "PERSEVERANCE", // English
]

// Timing. Each word holds long enough to read and to let its swap finish, so no
// language is dropped. The rotation drives everything: it advances through every
// word once (loop off), and only once English lands do we hold briefly, then
// fade to the site. The counter is timed to hit 100 at that same moment.
const ROTATE_MS = 750 // how long each word holds
const HOLD_MS = 500 // pause on the final word before revealing
const FADE_MS = 450 // fade-out of the overlay
const LAST = WORDS.length - 1
const RUN_MS = LAST * ROTATE_MS + HOLD_MS // 0 -> 100 spans the whole rotation

// The counter lives in its own component so its per-frame updates never re-render
// the rotating word (which would otherwise reset its animation timers).
function BootCounter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / RUN_MS)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="loader__count" aria-hidden="true">
      {count}
    </div>
  )
}

export default function Loader({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const finishedRef = useRef(false)
  // Read the reduced-motion preference once; motion-sensitive visitors skip the
  // animated intro entirely and land straight on the site.
  const reduced = useRef(
    typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current

  useEffect(() => {
    if (reduced) onDone()
  }, [reduced, onDone])

  // Reveal the site only after the rotation has reached the final (English) word.
  const handleNext = useCallback(
    (index: number) => {
      if (index !== LAST || finishedRef.current) return
      finishedRef.current = true
      window.setTimeout(() => {
        setLeaving(true)
        window.setTimeout(onDone, FADE_MS)
      }, HOLD_MS)
    },
    [onDone],
  )

  if (reduced) return null

  return (
    <div
      className={"loader" + (leaving ? " loader--leaving" : "")}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="loader__word">
        <RotatingText
          texts={WORDS}
          rotationInterval={ROTATE_MS}
          loop={false}
          auto
          onNext={handleNext}
          splitBy="characters"
          // No per-character stagger: the whole word swaps as one unit, straight
          // up and out, so it stays centred and never drifts sideways.
          staggerDuration={0}
          animatePresenceMode="wait"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "tween", ease: [0.22, 0.68, 0.24, 1], duration: 0.3 }}
          mainClassName="loader__rotate"
        />
      </div>
      <BootCounter />
    </div>
  )
}
