// Scroll-driven hero: the visitor's scroll scrubs a short clip in which Jayanth's
// silhouette turns to camera and the camera pushes into the pink lens. At the end
// the lens glow hands off to a flat pink panel in exactly the site's pink, and the
// page continues on pink. The name and role are real text, readable before any scroll.
import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import video from '../assets/hero/hero.mp4'
import poster from '../assets/hero/hero-poster.webp'
import { heroTimeAt } from '../content/heroTimeline'
import './Hero.css'

// Share of the scroll spent scrubbing the clip; the rest is the pink flood settling.
const SCRUB_END = 0.9

export default function Hero() {
  const track = useRef<HTMLDivElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
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
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduced) return
    wanted.current = heroTimeAt(Math.min(1, p / SCRUB_END))
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

  const introOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -24])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])
  // The clip's own lens glow is close to #FF4FA3; this panel lands it on the exact value.
  const flood = useTransform(scrollYProgress, [0.8, 0.9], [0, 1])

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
