// "Ask about me" at the end of the home page. Fixed answers only, no AI: each comes from
// about-me.md via src/content/ask.ts. Takeover version (Jayanth, 2026-10-19; replaces the
// redacted bars of 2026-10-18): once someone asks, the question zooms out from the field's
// size to a small label in the same font (Jayanth, 2026-10-19) and the answer takes the big type, its words fading up one after another. "Ask another"
// brings the field back. No redactions: work authorization, salary and start dates get a plain
// "ask me directly" line and Say hi; anything unmatched gets a plain "no answer" line. Only the
// answer is shown, no sources (Jayanth's call). Reduced motion: the answer just appears.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useCards } from './Cards'
import { SUGGESTIONS, answer } from '../content/ask'
import './AskBox.css'

// from: how much bigger the field's type was than the label's, so the question can shrink from it.
type Shown = { question: string; text: string; isPrivate: boolean; n: number; from: number }

const PRIVATE = "That one's better in person. Ask me directly."
const NONE = "I don't have an answer for that one."
const WORD_STAGGER = 40 // ms between words
const WORDS_AFTER = 150 // ms: the answer starts once the question has mostly zoomed out

export default function AskBox() {
  const { openCard } = useCards()
  const [question, setQuestion] = useState('')
  const [shown, setShown] = useState<Shown | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const again = useRef<HTMLButtonElement>(null)
  const returning = useRef(false)

  const ask = (q: string) => {
    const r = answer(q)
    if (!r) return
    // The question keeps its font and zooms out from the field's size to the label's.
    const field = input.current ? parseFloat(getComputedStyle(input.current).fontSize) : 0
    const label = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--text-body')) || 18
    setQuestion('')
    setShown((s) => ({
      from: field ? field / label : 1,
      question: q.trim(),
      text: r.kind === 'answer' ? r.fact.answer : r.kind === 'direct' ? PRIVATE : NONE,
      isPrivate: r.kind === 'direct',
      n: (s?.n ?? 0) + 1,
    }))
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(question)
  }
  const reset = () => {
    returning.current = true
    setShown(null)
  }

  // Keyboard focus follows the swap: to "Ask another" once answered, back to the field after.
  useEffect(() => {
    if (shown) again.current?.focus({ preventScroll: true })
    else if (returning.current) input.current?.focus({ preventScroll: true })
    returning.current = false
  }, [shown])

  return (
    <section className="ask" aria-labelledby="ask-title">
      <div className="ask-inner">
        <h2 id="ask-title" className="visually-hidden">
          Ask about me
        </h2>
        {shown ? (
          <div key={shown.n} className="ask-shown" aria-live="polite">
            <p className="ask-q" style={{ ['--from' as string]: shown.from }}>
              {shown.question}
            </p>
            <p className="ask-a">
              <span className="visually-hidden">{shown.text}</span>
              <span aria-hidden="true">
                {shown.text.split(' ').map((w, i) => (
                  <span key={i} className="ask-word" style={{ animationDelay: `${WORDS_AFTER + i * WORD_STAGGER}ms` }}>
                    {w}{' '}
                  </span>
                ))}
              </span>
            </p>
            <div className="ask-next">
              {shown.isPrivate && (
                <button type="button" className="btn btn--ink" onClick={() => openCard('contact')}>
                  Say hi →
                </button>
              )}
              <button ref={again} type="button" className="ask-again mono" onClick={reset}>
                Ask another
              </button>
            </div>
          </div>
        ) : (
          <>
            <form className="ask-form" onSubmit={submit}>
              <label className="visually-hidden" htmlFor="ask-q">
                Your question
              </label>
              <input
                ref={input}
                id="ask-q"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me something"
                autoComplete="off"
                enterKeyHint="send"
              />
            </form>
            <ul className="ask-tries mono" aria-label="Try one">
              {SUGGESTIONS.map((q) => (
                <li key={q}>
                  <button type="button" onClick={() => ask(q)}>
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}
