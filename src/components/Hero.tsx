// Scroll-driven hero: the visitor's scroll scrubs a short clip in which Jayanth's
// silhouette turns to camera and the camera pushes all the way into the pink lens.
// A flat panel then lands on exactly the site's pink, and the page continues on pink.
// The name and role are real text, readable before any scroll.
import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import video from '../assets/hero/hero.mp4'
import poster from '../assets/hero/hero-poster.webp'
import { videoTimeAt } from '../content/heroTimeline'
import { intro } from '../content/about'
import ScrollText from './ScrollText'
import { useCards } from './Cards'
import './Hero.css'

// Scroll budget (fractions of the hero's scroll distance).
const VIDEO_END = 0.9 // the clip reaches the lens here
const FLOOD = [0.8, 0.9] // flat pink takes over from the lens glow
// The line on pink starts assembling as the pink is nearly flat (only a faint shadow of
// the nose bridge left) and is fully formed just before the hero scrolls away.
const LINE = [0.85, 0.97]

export default function Hero() {
  const track = useRef<HTMLDivElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const { setOnPink } = useCards()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })

  // Seek at most once per frame, and never while a seek is still running.
  const wanted = useRef(0)
  const queued = useRef(false)
  const seek = () => {
    queued.current = false
    const v = vid.current
    if (!v || v.readyState < 1) return
    if (v.seeking) {
      queued.current = true
      requestAnimationFrame(seek)
      return
    }
    if (Math.abs(v.currentTime - wanted.current) > 0.01) v.currentTime = wanted.current
  }
  // Once the pink is flat, the site is "on pink": the nav steps aside and cards turn white.
  useMotionValueEvent(scrollYProgress, 'change', (p) => setOnPink(p >= 0.86))
  useEffect(() => () => setOnPink(false), [setOnPink])
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduced) return
    wanted.current = videoTimeAt(p / VIDEO_END)
    if (!queued.current) {
      queued.current = true
      requestAnimationFrame(seek)
    }
  })

  // iOS Safari only paints a seeked frame after the video has been "played" once.
  useEffect(() => {
    const v = vid.current
    if (!v || reduced) return
    const unlock = () => {
      v.play().then(() => v.pause()).catch(() => {})
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('touchstart', unlock, { passive: true })
    return () => window.removeEventListener('touchstart', unlock)
  }, [reduced])

  const flood = useTransform(scrollYProgress, FLOOD, [0, 1])
  const line = useTransform(scrollYProgress, LINE, [0, 1])
  const introOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.1], [0, -24])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])

  if (reduced) {
    return (
      <section className="hero hero--static" aria-label="Introduction">
        <img className="hero-media" src={poster} alt="Silhouette of Jayanth in profile, wearing ski goggles with a glowing pink lens" />
        <div className="hero-intro">
          <h1 className="display hero-name">Jayanth Kappagantula</h1>
          <p className="mono">Product manager · Healthcare · 0 → 1</p>
        </div>
      </section>
    )
  }

  return (
    <section ref={track} className="hero" aria-label="Introduction">
      <div className="hero-stage">
        <video
          ref={vid}
          className="hero-media"
          src={video}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-label="Silhouette of Jayanth turning to the camera; the view pushes into his glowing pink goggles"
        />
        <m.div className="hero-flood" style={{ opacity: flood }} aria-hidden="true" />
        <ScrollText as="h2" className="display hero-line" text={intro.headline} progress={line} />
        <m.div className="hero-intro" style={{ opacity: introOpacity, y: introY }}>
          <h1 className="display hero-name">Jayanth Kappagantula</h1>
          <p className="mono">Product manager · Healthcare · 0 → 1</p>
        </m.div>
        <m.p className="hero-cue mono" style={{ opacity: cueOpacity }} aria-hidden="true">
          Scroll ↓
        </m.p>
      </div>
    </section>
  )
}
