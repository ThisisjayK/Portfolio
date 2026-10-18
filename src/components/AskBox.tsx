// "Ask about me" at the end of the home page (Jayanth, 2026-10-17; the idea from aiu.is's FAQ
// demo). Fixed answers only, no AI: each comes from about-me.md and shows its source; work
// authorization, salary and start dates go to Contact; anything else gets no answer, on purpose.
import { useState, type FormEvent } from 'react'
import RevealText from './RevealText'
import { useCards } from './Cards'
import { SUGGESTIONS, answer, type Reply } from '../content/ask'
import './AskBox.css'

export default function AskBox() {
  const { openCard } = useCards()
  const [question, setQuestion] = useState('')
  const [reply, setReply] = useState<Reply | null>(null)

  const ask = (q: string) => {
    setQuestion(q)
    setReply(answer(q))
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(question)
  }

  return (
    <section className="ask" aria-labelledby="ask-title">
      <div className="ask-inner">
        <RevealText as="h2" id="ask-title" className="display ask-title" text="Ask about me" />
        <p className="ask-note">Answers come only from my own notes, with where each one comes from. If it isn't in there, you'll get nothing rather than a guess.</p>
        <form className="ask-form" onSubmit={submit}>
          <label className="visually-hidden" htmlFor="ask-q">
            Your question
          </label>
          <input
            id="ask-q"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Where did you study?"
            autoComplete="off"
          />
          <button type="submit" className="btn btn--ink">
            Ask
          </button>
        </form>
        <ul className="ask-chips" aria-label="Try one">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button type="button" onClick={() => ask(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>
        <div className="ask-out" aria-live="polite">
          {reply?.kind === 'answer' && (
            <>
              <p className="ask-answer">{reply.fact.answer}</p>
              <p className="ask-source mono">Source · {reply.fact.source}</p>
            </>
          )}
          {reply?.kind === 'direct' && (
            <>
              <p className="ask-answer">That's one to ask me directly, so you get the exact answer.</p>
              <button type="button" className="btn btn--outline" onClick={() => openCard('contact')}>
                Say hi
              </button>
            </>
          )}
          {reply?.kind === 'none' && <p className="ask-source mono">Nothing in my notes about that.</p>}
        </div>
      </div>
    </section>
  )
}
