// Text that reveals line by line as it scrolls into view (Jayanth, 2026-10-17; after
// neutomni.com's blur reveal, written from scratch): each line fades in, sharpens from a 10px
// blur and rises 15px, 0.12s after the line above. Text already on screen when the page opens
// just appears (the grid hop has drawn it). Screen readers get one clean copy of the text;
// the animated words are hidden from them. Reduced motion: no movement, always visible.
import { useLayoutEffect, useRef, type ElementType } from 'react'
import { useReducedMotion } from 'motion/react'

type Props = {
  text: string
  as?: ElementType
  className?: string
  id?: string
  // Passed through, e.g. data-hop so the grid hop picks it up.
  [data: `data-${string}`]: unknown
}

const LINE_STAGGER = 0.12 // s

export default function RevealText({ text, as: Tag = 'p', className, id, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const words = text.split(/\s+/)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    // Give every word its line's delay, measured from where the browser actually wrapped it.
    const place = () => {
      let line = -1
      let top: number | null = null
      el.querySelectorAll<HTMLElement>('.reveal-word').forEach((w) => {
        if (w.offsetTop !== top) {
          top = w.offsetTop
          line++
        }
        w.style.transitionDelay = `${line * LINE_STAGGER}s`
      })
    }
    place()
    // Already on screen when it mounts: show it now, in the same frame. Waiting for the observer
    // left the words 15px low for a frame, and the grid hop captured them there, so the text
    // jumped up when the real page took over (Jayanth saw it, 2026-10-18).
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
      el.classList.add('reveal--instant', 'reveal--in')
      window.addEventListener('resize', place)
      return () => window.removeEventListener('resize', place)
    }
    let first = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // On screen at the start: show it at once instead of animating.
          if (first) el.classList.add('reveal--instant')
          el.classList.add('reveal--in')
          io.disconnect()
        }
        first = false
      },
      { rootMargin: '0px 0px -15% 0px' }, // starts when the top passes 85% of the screen
    )
    io.observe(el)
    window.addEventListener('resize', place)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', place)
    }
  }, [text, reduced])

  if (reduced) {
    return (
      <Tag id={id} className={className} {...rest}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag ref={ref} id={id} className={className ? `reveal ${className}` : 'reveal'} {...rest}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="reveal-word">{w}</span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </Tag>
  )
}
