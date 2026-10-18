// "Ask about me" at the end of the home page. Fixed answers only, no AI: each comes from
// about-me.md via src/content/ask.ts. Redacted version (Jayanth, 2026-10-18, option 9 in
// design/ask-lab.html): the answer sits under white bars that lift off line by line. Only the
// answer is shown, no sources (Jayanth's call). Work authorization, salary and start dates stay
// redacted with "Ask me directly" and Say hi; anything unmatched gets a plain "no answer" line.
// Before anyone asks, the answer area is empty (no bars until there's a question). Reduced
// motion: no bars lift; the answer just appears.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { useCards } from './Cards'
import { SUGGESTIONS, answer } from '../content/ask'
import './AskBox.css'

type Doc = { text: string; mode: 'sealed' | 'reveal' | 'plain'; n: number }

const PRIVATE = 'This one is between us, so it stays off the page for now'
const NONE = "I don't have an answer for that one."

export default function AskBox() {
  const { openCard } = useCards()
  const reduced = useReducedMotion()
  const [question, setQuestion] = useState('')
  const [asked, setAsked] = useState(false)
  const [doc, setDoc] = useState<Doc>({ text: '', mode: 'plain', n: 0 })
  const [isPrivate, setIsPrivate] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  // React renders this layer empty and never touches its children; the bars are drawn into it.
  const barsRef = useRef<HTMLDivElement>(null)

  // One bar per rendered line, measured from where the browser wrapped the words.
  const drawBars = useCallback((lift: boolean) => {
    const p = textRef.current
    const layer = barsRef.current
    if (!p || !layer) return
    layer.replaceChildren()
    const lines: { top: number; left: number; right: number; h: number }[] = []
    p.querySelectorAll<HTMLElement>('span').forEach((w) => {
      const last = lines[lines.length - 1]
      if (!last || last.top !== w.offsetTop)
        lines.push({ top: w.offsetTop, left: w.offsetLeft, right: w.offsetLeft + w.offsetWidth, h: w.offsetHeight })
      else last.right = w.offsetLeft + w.offsetWidth
    })
    lines.forEach((l, i) => {
      const bar = document.createElement('span')
      bar.className = lift ? 'ask-bar ask-bar--lift' : 'ask-bar'
      bar.style.cssText = `--i:${i};top:${l.top + l.h * 0.04}px;left:${l.left - 4}px;width:${l.right - l.left + 8}px;height:${l.h * 0.92}px`
      if (lift) bar.addEventListener('animationend', () => bar.remove(), { once: true })
      layer.append(bar)
    })
  }, [])

  useLayoutEffect(() => {
    if (doc.mode === 'sealed') drawBars(false)
    else if (doc.mode === 'reveal' && !reduced) drawBars(true)
    else barsRef.current?.replaceChildren()
  }, [doc, reduced, drawBars])

  // Sealed text re-wraps on resize, so its bars are redrawn to match.
  useEffect(() => {
    if (doc.mode !== 'sealed') return
    const redraw = () => drawBars(false)
    window.addEventListener('resize', redraw)
    return () => window.removeEventListener('resize', redraw)
  }, [doc.mode, drawBars])

  const ask = (q: string) => {
    const r = answer(q)
    if (!r) return
    setAsked(true)
    setQuestion('')
    setIsPrivate(r.kind === 'direct')
    setDoc((d) => ({
      text: r.kind === 'answer' ? r.fact.answer : r.kind === 'direct' ? PRIVATE : NONE,
      mode: r.kind === 'answer' ? 'reveal' : r.kind === 'direct' ? 'sealed' : 'plain',
      n: d.n + 1,
    }))
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(question)
  }

  const sealed = doc.mode === 'sealed'

  return (
    <section className="ask" aria-labelledby="ask-title">
      <div className="ask-inner">
        <h2 id="ask-title" className="visually-hidden">
          Ask about me
        </h2>
        <form className="ask-form" onSubmit={submit}>
          <label className="visually-hidden" htmlFor="ask-q">
            Your question
          </label>
          <input
            id="ask-q"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={asked ? 'Ask something else' : 'Ask me something'}
            autoComplete="off"
            enterKeyHint="send"
          />
        </form>
        <ul className="ask-tries mono" aria-label="Try one">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => ask(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>
        <div aria-live="polite">
          <div className={sealed ? 'ask-doc ask-doc--sealed' : 'ask-doc'}>
            <p ref={textRef} key={doc.n} className="ask-text" aria-hidden={sealed || undefined}>
              {doc.text.split(' ').map((w, i) => (
                <span key={i}>{i ? ` ${w}` : w}</span>
              ))}
            </p>
            <div ref={barsRef} className="ask-bars" aria-hidden="true" />
          </div>
          {isPrivate && (
            <div className="ask-private">
              <p className="mono">Ask me directly.</p>
              <button type="button" className="btn btn--ink" onClick={() => openCard('contact')}>
                Say hi →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
