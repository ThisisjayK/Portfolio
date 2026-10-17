// The nav, fixed at the top: the site mark at the far left and, further in, a small
// "Menu" label over a stack of big words (after huyml.co). Hovering or focusing one word
// puts an arrow in front of it and blurs the rest. Work and Contact open floating cards;
// About and Playground are pages. Once the visitor has zoomed into the pink, the nav
// steps aside and only Contact stays, bottom-left.
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useCards, type CardName } from './Cards'
import SilkBall from './SilkBall'
import IndexMenu from './IndexMenu'
import './Nav.css'

export default function Nav() {
  const { card, openCard, onPink } = useCards()
  const { pathname } = useLocation()
  const off = onPink ? -1 : undefined
  const [indexOpen, setIndexOpen] = useState(false)

  // The arrow rests on the open card, or else on the current page.
  const current = (name: CardName | 'about' | 'playground') =>
    card ? card === name : pathname.startsWith(`/${name}`)
  const cls = (name: Parameters<typeof current>[0]) => (current(name) ? 'nav-item is-current' : 'nav-item')

  return (
    <>
      <header className={onPink ? 'nav nav--away' : 'nav'} aria-hidden={onPink || undefined}>
        <NavLink to="/" className="nav-mark" tabIndex={off}>
          <SilkBall size={28} paused={onPink} />
          <span className="visually-hidden">Jayanth Kappagantula, home</span>
        </NavLink>
        <nav className="nav-menu" aria-label="Main">
          {/* "Menu" opens the full-screen index; the words below stay as quick links. */}
          <button
            type="button"
            className="nav-label"
            aria-expanded={indexOpen}
            aria-controls="index-menu"
            onClick={() => setIndexOpen(true)}
            tabIndex={off}
          >
            Menu <span className="visually-hidden">(full index)</span>
          </button>
          <ul className="display">
            <li><button type="button" className={cls('work')} onClick={() => openCard('work')} tabIndex={off}>Work</button></li>
            <li><NavLink to="/about" className={cls('about')} tabIndex={off}>About</NavLink></li>
            <li><NavLink to="/playground" className={cls('playground')} tabIndex={off}>Playground</NavLink></li>
            <li><button type="button" className={cls('contact')} onClick={() => openCard('contact')} tabIndex={off}>Contact</button></li>
          </ul>
        </nav>
      </header>
      <button
        type="button"
        className={onPink ? 'nav-contact nav-contact--on' : 'nav-contact'}
        onClick={() => openCard('contact')}
        tabIndex={onPink ? undefined : -1}
        aria-hidden={!onPink || undefined}
      >
        Contact
      </button>
      <IndexMenu open={indexOpen} onClose={() => setIndexOpen(false)} />
    </>
  )
}
