// Scroll-driven hero: the visitor's scroll grows a bloom of blues (BlueBloom) out of the
// middle column, over the A–Z, until a flat panel lands on exactly the site's blue and the
// page continues on blue.
import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { intro } from '../content/about'
import ScrollText from './ScrollText'
import RollBox from './RollBox'
import BlueBloom, { bloomCovers } from './BlueBloom'
import { useCards } from './Cards'
import './Hero.css'

// Scroll budget (fractions of the hero's scroll distance), unchanged from the video version.
const FLOOD = [0.8, 0.9] // flat blue takes over from the bloom
// The line on blue starts assembling as the flood is nearly flat and is fully formed just
// before the hero scrolls away.
const LINE = [0.85, 0.97]
// A letter counts as covered once any of its sample spots is under the bloom.
const STEPS = [0.05, 0.35, 0.65, 0.95]
const SPOTS = STEPS.flatMap((fx) => STEPS.map((fy) => [fx, fy] as const))

export default function Hero() {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { setOnPink } = useCards()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const still = useMotionValue(0)
  const [bloomOk, setBloomOk] = useState(false)

  // Once the blue is flat, the site is "on blue": the nav steps aside and cards turn white.
  useMotionValueEvent(scrollYProgress, 'change', (p) => setOnPink(p >= 0.86))
  useEffect(() => () => setOnPink(false), [setOnPink])

  // The A–Z stays put while the bloom grows, and the bloom passes over it: on every scroll,
  // each letter (and the nav, data-zoom-cover; the roll box always stays) whose spot is under a dark enough layer
  // fades out and goes inert. Worked out from the bloom's geometry, not by reading pixels.
  // Without WebGL there's no visible bloom, so nothing is hidden until the flood.
  useEffect(() => {
    const el = stage.current
    if (!el || reduced || !bloomOk) return
    const check = () => {
      const p = scrollYProgress.get()
      const box = el.getBoundingClientRect()
      document.querySelectorAll<HTMLElement>('.hero .letter, [data-zoom-cover]').forEach((item) => {
        // A 4×4 grid of spots edge to edge, so a bloom that clips only one end still counts.
        const r = item.getBoundingClientRect()
        const clear = SPOTS.every(
          ([fx, fy]) =>
            !bloomCovers(r.left + r.width * fx - box.left, r.top + r.height * fy - box.top, p, box.width, box.height),
        )
        if (clear) {
          item.removeAttribute('data-covered')
          item.inert = false
        } else {
          item.setAttribute('data-covered', '')
          item.inert = true
        }
      })
    }
    check()
    const off = scrollYProgress.on('change', check)
    window.addEventListener('resize', check)
    return () => {
      // Leaving the home page mid-bloom must never leave anything hidden.
      document.querySelectorAll<HTMLElement>('[data-zoom-cover]').forEach((item) => {
        item.removeAttribute('data-covered')
        item.inert = false
      })
      off()
      window.removeEventListener('resize', check)
    }
  }, [reduced, bloomOk, scrollYProgress])

  const flood = useTransform(scrollYProgress, FLOOD, [0, 1])
  const line = useTransform(scrollYProgress, LINE, [0, 1])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])

  if (reduced) {
    return (
      <section className="hero hero--static" aria-label="Introduction">
        {/* Reduced motion: one still frame, before any scroll (white grain and the cobalt drop). */}
        <BlueBloom className="hero-media" progress={still} />
        {/* The A–Z letters are off the landing page for now (Jayanth, 2026-10-17); the index
            nav (IndexNav) leads to the letter pages instead. LetterGrid.tsx is kept. */}
        <RollBox />
        {/* The name and role aren't shown (Jayanth, 2026-10-16); they stay as the page heading for screen readers and search. */}
        <h1 className="visually-hidden">Jayanth Kappagantula, product manager in healthcare</h1>
      </section>
    )
  }

  return (
    <section ref={track} className="hero" aria-label="Introduction">
      <div ref={stage} className="hero-stage">
        <BlueBloom className="hero-media" progress={scrollYProgress} onReady={setBloomOk} />
        <m.div className="hero-flood" style={{ opacity: flood }} aria-hidden="true" />
        <ScrollText as="h2" className="display hero-line" text={intro.headline} progress={line} />
        {/* The name and role aren't shown (Jayanth, 2026-10-16); they stay as the page heading for screen readers and search. */}
        <h1 className="visually-hidden">Jayanth Kappagantula, product manager in healthcare</h1>
        <m.p className="hero-cue mono" style={{ opacity: cueOpacity }} aria-hidden="true" data-hop>
          Scroll ↓
        </m.p>
      </div>
      {/* Outside the sticky stage, so it stays pinned above the sections after the hero. */}
      <RollBox />
    </section>
  )
}
