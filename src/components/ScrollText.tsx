// Text whose letters assemble as you scroll (and come apart if you scroll back).
// Each character rises and sharpens over its own slice of `progress`, staggered
// left to right: the same feel as the old TextReveal "Split" look (removed 2026-10-17), but
// scrubbed by scroll instead of played on a timer.
import { useTransform, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import type { ElementType } from 'react'

type Props = {
  text: string
  progress: MotionValue<number> // 0 → nothing shown, 1 → fully assembled
  as?: ElementType
  className?: string
  /** Fraction of the progress each piece takes to land (the rest is stagger). */
  overlap?: number
  /** 'character' for short headlines, 'word' for sentences. */
  splitBy?: 'character' | 'word'
}

export default function ScrollText({ text, progress, as: Tag = 'p', className, overlap = 0.25, splitBy = 'character' }: Props) {
  const n = splitBy === 'word' ? text.split(' ').length : [...text].length
  const words = text.split(' ')
  let i = 0

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={w}>
          <span className="tr-word" aria-hidden="true">
            {(splitBy === 'word' ? [word] : [...word]).map((ch) => {
              const k = i++
              const start = (k / Math.max(n - 1, 1)) * (1 - overlap)
              return <Char key={k} ch={ch} progress={progress} start={start} end={start + overlap} />
            })}
          </span>
          {w < words.length - 1 ? (splitBy === 'character' && i++, ' ') : null}
        </span>
      ))}
    </Tag>
  )
}

function Char({ ch, progress, start, end }: { ch: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0, 1])
  const y = useTransform(progress, [start, end], ['0.6em', '0em'])
  const filter = useTransform(progress, [start, end], ['blur(6px)', 'blur(0px)'])
  return (
    <m.span className="tr-unit" style={{ opacity, y, filter }}>
      {ch}
    </m.span>
  )
}
