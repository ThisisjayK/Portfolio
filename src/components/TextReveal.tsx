// Text that assembles itself when it scrolls into view. Matches the feel of the
// "Split" preset of the Framer TextMotion component Jayanth picked (each character
// rises 48px and sharpens from an 8px blur, critically damped spring, 0.02s stagger),
// reimplemented here with Motion so it runs outside Framer and the code is our own.
import { useRef, type ElementType } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** 'character' for headlines, 'word' for body copy. */
  splitBy?: 'character' | 'word'
  y?: number
  blur?: number
  stagger?: number
  delay?: number
}

export default function TextReveal({
  text,
  as: Tag = 'p',
  className,
  splitBy = 'character',
  y = 48,
  blur = 8,
  stagger = 0.02,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()

  if (reduced) return <Tag className={className}>{text}</Tag>

  const words = text.split(' ')
  let unit = 0
  const piece = (content: string, key: string) => {
    const i = unit++
    return (
      <m.span
        key={key}
        className="tr-unit"
        initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
        transition={{ type: 'spring', bounce: 0, duration: 0.7, delay: delay + i * stagger }}
      >
        {content}
      </m.span>
    )
  }

  return (
    // The full text is the accessible name; the animated pieces are hidden from screen readers.
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w}>
          <span className="tr-word" aria-hidden="true">
            {splitBy === 'word' ? piece(word, `${w}`) : [...word].map((ch, c) => piece(ch, `${w}-${c}`))}
          </span>
          {/* The space sits outside the word box so it isn't collapsed. */}
          {w < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
