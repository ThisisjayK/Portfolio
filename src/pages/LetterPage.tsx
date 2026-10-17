// One page per clickable letter of the hero's A–Z (Jayanth, 2026-10-17, after aiu.is).
// Empty on purpose: a heading, a subheading and the text, in one column in the middle of the
// page, all in the accent. The pinned roll box (top-left) is the way home; leaving shatters the
// page (shatter.ts) and the text builds in on arrival (TextReveal).
import { useLayoutEffect } from 'react'
import TextReveal from '../components/TextReveal'
import RollBox from '../components/RollBox'
import type { LetterPage as Entry } from '../content/letters'
import './LetterPage.css'

export default function LetterPage({ page }: { page: Entry }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const paragraphs = [page.note.body, ...page.more]

  return (
    <article className="lp" aria-labelledby="lp-title">
      <RollBox />
      <div className="lp-column">
        <div data-shatter>
          <TextReveal as="h1" className="display lp-title" text={page.topic} />
        </div>
        <div data-shatter>
          <TextReveal as="h2" className="display lp-sub" text={page.note.title} splitBy="word" delay={0.1} />
        </div>
        {paragraphs.map((p, k) => (
          <div key={k} data-shatter>
            <TextReveal className="lp-text" text={p} splitBy="word" delay={0.2 + k * 0.08} />
          </div>
        ))}
      </div>
    </article>
  )
}
