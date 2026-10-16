// Scroll-driven hero, in two phases:
//  1. Scroll scrubs the clip: Jayanth's silhouette turns to camera while the camera
//     pushes in (the clip is a real camera move until VIDEO_CUT).
//  2. The video holds on that frame and the whole picture zooms toward the lens in
//     code (head, goggles and shoulders grow together), the lens glow blooms, and a
//     flat panel lands on exactly the site's pink. The page then continues on pink.
// The name and role are real text, readable before any scroll.
import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import video from '../assets/hero/hero.mp4'
import poster from '../assets/hero/hero-poster.webp'
import { LENS_TARGET, LENS_WIDTH, VIDEO_CUT, videoTimeAt, zoomAt } from '../content/heroTimeline'
import './Hero.css'

// Scroll budget (fractions of the hero's scroll distance).
const VIDEO_END = 0.36 // turn + camera push from the clip
const ZOOM_END = 0.9 // code zoom into the lens
const FLOOD = [0.78, 0.9] // flat pink takes over
// Must match object-position in Hero.css.
const OBJECT_POS = { x: 0.56, y: 0.5 }

export default function Hero() {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
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
    wanted.current = p >= VIDEO_END ? VIDEO_CUT : videoTimeAt(p / VIDEO_END)
    if (!queued.current) {
      queued.current = true
      requestAnimationFrame(seek)
    }
  })

  // The zoom pivots on the lens. With object-fit: cover the video frame is scaled and
  // cropped, so convert the lens position from frame fractions to stage pixels.
  const [origin, setOrigin] = useState({ x: 0, y: 0, lens: 0 })
  useEffect(() => {
    const el = stage.current
    const v = vid.current
    if (!el || !v) return
    const place = () => {
      const W = el.clientWidth
      const H = el.clientHeight
      const vw = v.videoWidth || 1920
      const vh = v.videoHeight || 1072
      const c = Math.max(W / vw, H / vh)
      const dw = vw * c
      const dh = vh * c
      const x = (W - dw) * OBJECT_POS.x + LENS_TARGET.x * dw
      const y = (H - dh) * OBJECT_POS.y + LENS_TARGET.y * dh
      setOrigin({ x, y, lens: LENS_WIDTH * dw })
    }
    place()
    v.addEventListener('loadedmetadata', place)
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => {
      v.removeEventListener('loadedmetadata', place)
      ro.disconnect()
    }
  }, [])

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

  const zoomPhase = (p: number) => (p - VIDEO_END) / (ZOOM_END - VIDEO_END)
  const scale = useTransform(scrollYProgress, (p) => (p <= VIDEO_END ? 1 : zoomAt(zoomPhase(p))))
  const bloom = useTransform(scrollYProgress, (p) => Math.min(1, Math.max(0, (zoomPhase(p) - 0.6) / 0.35)))
  const flood = useTransform(scrollYProgress, FLOOD, [0, 1])
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
      <div ref={stage} className="hero-stage">
        <m.div className="hero-zoom" style={{ scale, transformOrigin: `${origin.x}px ${origin.y}px` }}>
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
          {/* Lens glow: lives inside the zoom layer so it grows with the goggles, sized
              to the lens and fading out at its own edge so the head stays black. */}
          <m.div
            className="hero-bloom"
            style={{ opacity: bloom, left: origin.x, top: origin.y, width: origin.lens * 1.25, height: origin.lens * 1.25 }}
            aria-hidden="true"
          />
        </m.div>
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
