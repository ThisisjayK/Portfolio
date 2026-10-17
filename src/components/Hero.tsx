// Scroll-driven hero: the visitor's scroll scrubs a short clip in which Jayanth's
// silhouette turns to camera and the camera pushes all the way into the pink lens.
// A flat panel then lands on exactly the site's pink, and the page continues on pink.
import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import video from '../assets/hero/hero.mp4'
import poster from '../assets/hero/hero-poster.webp'
import { videoTimeAt } from '../content/heroTimeline'
import { intro } from '../content/about'
import ScrollText from './ScrollText'
import LetterGrid from './LetterGrid'
import RollBox from './RollBox'
import { useCards } from './Cards'
import './Hero.css'

// Scroll budget (fractions of the hero's scroll distance).
const VIDEO_END = 0.9 // the clip reaches the lens here
const FLOOD = [0.8, 0.9] // flat pink takes over from the lens glow
// The line on pink starts assembling as the pink is nearly flat (only a faint shadow of
// the nose bridge left) and is fully formed just before the hero scrolls away.
const LINE = [0.85, 0.97]
// A letter (or the nav's mark or menu) counts as covered once any of its sample spots is no
// longer near-white.
const WHITE = 235
const STEPS = [0.05, 0.35, 0.65, 0.95]
const SPOTS = STEPS.flatMap((fx) => STEPS.map((fy) => [fx, fy] as const))

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

  // The A–Z stays put while the camera pushes in, and the zoom passes over it: after each
  // seek, the frame is drawn into a tiny canvas and every letter whose spot is no longer
  // white fades out and goes inert. (The darken blend in LetterGrid.css handles the
  // silhouette's soft edges in between.)
  useEffect(() => {
    const v = vid.current
    const stage = v?.parentElement
    if (!v || !stage || reduced) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const check = () => {
      if (!v.videoWidth) return
      const cw = 192
      const ch = Math.round((cw * v.videoHeight) / v.videoWidth)
      if (canvas.width !== cw) {
        canvas.width = cw
        canvas.height = ch
      }
      ctx.drawImage(v, 0, 0, cw, ch)
      const px = ctx.getImageData(0, 0, cw, ch).data
      // object-fit: cover with object-position 56% 50% (Hero.css).
      const box = v.getBoundingClientRect()
      const s = Math.max(box.width / v.videoWidth, box.height / v.videoHeight)
      const ox = (box.width - v.videoWidth * s) * 0.56
      const oy = (box.height - v.videoHeight * s) * 0.5
      const k = cw / v.videoWidth
      const white = (x: number, y: number) => {
        const vx = Math.round(((x - box.left - ox) / s) * k)
        const vy = Math.round(((y - box.top - oy) / s) * k)
        if (vx < 0 || vy < 0 || vx >= cw || vy >= ch) return true
        const i = (vy * cw + vx) * 4
        // An empty canvas (frame not painted yet) reads as transparent: treat it as uncovered.
        if (px[i + 3] === 0) return true
        return (px[i] + px[i + 1] + px[i + 2]) / 3 > WHITE
      }
      // The letters, plus the nav's mark and menu (data-zoom-cover), which also step aside.
      document.querySelectorAll<HTMLElement>('.hero .letter, [data-zoom-cover]').forEach((el) => {
        // A 4×4 grid of spots edge to edge, so a zoom that clips only one end still counts.
        const r = el.getBoundingClientRect()
        const clear = SPOTS.every(([fx, fy]) => white(r.left + r.width * fx, r.top + r.height * fy))
        if (clear) {
          el.removeAttribute('data-covered')
          el.inert = false
        } else {
          el.setAttribute('data-covered', '')
          el.inert = true
        }
      })
    }
    v.addEventListener('seeked', check)
    v.addEventListener('loadeddata', check)
    v.addEventListener('canplay', check)
    window.addEventListener('resize', check)
    return () => {
      // Leaving the home page mid-zoom must never leave the nav hidden.
      document.querySelectorAll<HTMLElement>('[data-zoom-cover]').forEach((el) => {
        el.removeAttribute('data-covered')
        el.inert = false
      })
      v.removeEventListener('seeked', check)
      v.removeEventListener('loadeddata', check)
      v.removeEventListener('canplay', check)
      window.removeEventListener('resize', check)
    }
  }, [reduced])

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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0])
  // Belt and braces: once on the pink flood, no letter takes clicks or focus.
  const [lettersGone, setLettersGone] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (p) => setLettersGone(p >= 0.86))

  if (reduced) {
    return (
      <section className="hero hero--static" aria-label="Introduction">
        <img className="hero-media" src={poster} alt="Silhouette of Jayanth in profile, wearing ski goggles with a glowing pink lens" />
        <LetterGrid />
        <RollBox />
        {/* The name and role aren't shown (Jayanth, 2026-10-16); they stay as the page heading for screen readers and search. */}
        <h1 className="visually-hidden">Jayanth Kappagantula, product manager in healthcare</h1>
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
        <LetterGrid hidden={lettersGone} />
        <RollBox />
        <m.div className="hero-flood" style={{ opacity: flood }} aria-hidden="true" />
        <ScrollText as="h2" className="display hero-line" text={intro.headline} progress={line} />
        {/* The name and role aren't shown (Jayanth, 2026-10-16); they stay as the page heading for screen readers and search. */}
        <h1 className="visually-hidden">Jayanth Kappagantula, product manager in healthcare</h1>
        <m.p className="hero-cue mono" style={{ opacity: cueOpacity }} aria-hidden="true">
          Scroll ↓
        </m.p>
      </div>
    </section>
  )
}
