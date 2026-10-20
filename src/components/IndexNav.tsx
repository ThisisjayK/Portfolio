// The index (Jayanth, 2026-10-17, after aiu.is's index nav; see design-system.md §7): a fixed
// left column under the roll box, in groups, each item marked with its letter, and a counter at
// the bottom. It lives outside the page content, so it stays perfectly still while pages
// break apart and reassemble (grid hop); it only twitches.
// - Hover or keyboard focus: a heavy bar wipes in left to right through the middle of the words,
//   like a thick strikethrough, leaving a gap above and below; the words knock out to white
//   where it crosses them. It wipes out to the right on leave. The current page keeps the bar.
// - On the home page each item steps aside as the bloom covers its spot (data-zoom-cover,
//   Hero.tsx), and the whole index hides on the blue sections.
// - Phones: an "Index" button opens the same index full screen, as a proper dialog.
import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useCards } from './Cards'
import { usePageHop } from './pageHop'
import { letterPages, type LetterPage } from '../content/letters'
import './IndexNav.css'

type Group = { marker: string; title: string; pages: LetterPage[] }

// About me, Work and Skills sit under About (Work added 2026-10-18, Skills 2026-10-19, Jayanth);
// the rest are interests.
const ABOUT = ['about-me', 'work', 'skills']
const GROUPS: Group[] = [
  { marker: '01', title: 'About', pages: ABOUT.map((s) => letterPages.find((p) => p.slug === s)!) },
  { marker: '02', title: 'Interests', pages: letterPages.filter((p) => !ABOUT.includes(p.slug)) },
]

const pad = (n: number) => String(n).padStart(3, '0')

// The strike runs on pointer enter/leave and keyboard focus/blur (not on mouse focus).
const strikeIn = (e: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
  if (e.type === 'focus' && !e.currentTarget.matches(':focus-visible')) return
  e.currentTarget.dataset.strike = 'in'
}
const strikeOut = (e: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
  if (e.currentTarget.dataset.strike === 'in') e.currentTarget.dataset.strike = 'out'
}

function IndexList({
  current,
  onGo,
  onContact,
  big,
}: {
  current: string
  onGo: (page: LetterPage, e: MouseEvent<HTMLAnchorElement>) => void
  onContact: () => void
  big?: boolean
}) {
  return (
    <div className={big ? 'index-list index-list--big' : 'index-list'}>
      {GROUPS.map((g) => (
        <section key={g.marker} className="index-group" aria-labelledby={`index-${g.marker}${big ? '-big' : ''}`}>
          <h2 className="index-group-title" id={`index-${g.marker}${big ? '-big' : ''}`} data-zoom-cover={big ? undefined : ''}>
            <span className="index-marker mono">{g.marker}</span>
            {g.title}
          </h2>
          <ul className="index-items">
            {g.pages.map((p) => (
              <li key={p.slug} data-zoom-cover={big ? undefined : ''}>
                <span className="index-key mono" aria-hidden="true">
                  {p.letter}
                </span>
                <a
                  className="index-link"
                  href={`${import.meta.env.BASE_URL}${p.slug}`}
                  data-label={p.topic}
                  aria-current={current === p.slug ? 'page' : undefined}
                  onClick={(e) => onGo(p, e)}
                  onPointerEnter={strikeIn}
                  onPointerLeave={strikeOut}
                  onFocus={strikeIn}
                  onBlur={strikeOut}
                >
                  {p.topic}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="index-group" aria-label="Contact">
        <h2 className="index-group-title" data-zoom-cover={big ? undefined : ''}>
          <span className="index-marker mono">03</span>
          Contact
        </h2>
        <ul className="index-items">
          <li data-zoom-cover={big ? undefined : ''}>
            <span className="index-key mono" aria-hidden="true">@</span>
            <button
              type="button"
              className="index-link"
              data-label="Say hi"
              onClick={onContact}
              onPointerEnter={strikeIn}
              onPointerLeave={strikeOut}
              onFocus={strikeIn}
              onBlur={strikeOut}
            >
              Say hi
            </button>
          </li>
        </ul>
      </section>
    </div>
  )
}

export default function IndexNav() {
  const { pathname } = useLocation()
  const { onPink, openCard } = useCards()
  const go = usePageHop()
  const nav = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const current = pathname.replace(/^\/+|\/+$/g, '')

  const onGo = (page: LetterPage, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    if (current === page.slug) return
    // The index stays put while the page breaks apart; it only twitches.
    const el = nav.current
    if (el) {
      el.classList.remove('is-twitching')
      void el.offsetWidth
      el.classList.add('is-twitching')
    }
    const r = e.currentTarget.getBoundingClientRect()
    go(`/${page.slug}`, { origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } })
  }
  const onContact = () => {
    setOpen(false)
    openCard('contact')
  }

  // Phone dialog: lock the page, focus the first item, Esc closes, focus goes back to the button.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector<HTMLElement>('.index-link')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopImmediatePropagation() // don't also trigger the letter page's Esc-to-close
      setOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    const btn = toggle.current
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey, true)
      btn?.focus()
    }
  }, [open])

  // On the home page the index hides on the blue sections.
  const away = onPink && current === ''

  return (
    <>
      <nav
        ref={nav}
        className={away ? 'index index--away' : 'index'}
        aria-label="Index"
        aria-hidden={away || undefined}
        inert={away || undefined}
        onAnimationEnd={(e) => e.currentTarget.classList.remove('is-twitching')}
      >
        <p className="index-label mono">Index</p>
        <IndexList current={current} onGo={onGo} onContact={onContact} />
        <p className="index-count mono" aria-label={`${letterPages.length} pages`}>
          {pad(letterPages.length)}
        </p>
      </nav>

      {/* Phones */}
      <button
        ref={toggle}
        type="button"
        className={open ? 'index-toggle is-open' : 'index-toggle'}
        aria-expanded={open}
        aria-controls="index-dialog"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Index'}
      </button>
      {open && (
        <div ref={dialog} id="index-dialog" className="index-dialog" role="dialog" aria-modal="true" aria-label="Index">
          <IndexList current={current} onGo={onGo} onContact={onContact} big />
          <p className="index-count mono">{pad(letterPages.length)}</p>
        </div>
      )}
    </>
  )
}
