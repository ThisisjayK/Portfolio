// Vertical nav, fixed at the top-left. Work and Contact open floating cards; About and
// Playground are pages. Once the visitor has zoomed into the pink, the list steps
// aside and only Contact stays, bottom-left.
import { NavLink } from 'react-router-dom'
import { useCards } from './Cards'
import './Nav.css'

export default function Nav() {
  const { openCard, onPink } = useCards()
  return (
    <>
      <header className={onPink ? 'nav mono nav--away' : 'nav mono'} aria-hidden={onPink || undefined}>
        <NavLink to="/" className="nav-name" tabIndex={onPink ? -1 : undefined}>Jayanth K.</NavLink>
        <nav aria-label="Main">
          <ul>
            <li><NavLink to="/about" tabIndex={onPink ? -1 : undefined}>About</NavLink></li>
            <li><button type="button" onClick={() => openCard('work')} tabIndex={onPink ? -1 : undefined}>Work</button></li>
            <li><NavLink to="/playground" tabIndex={onPink ? -1 : undefined}>Playground</NavLink></li>
            <li><button type="button" onClick={() => openCard('contact')} tabIndex={onPink ? -1 : undefined}>Contact</button></li>
          </ul>
        </nav>
      </header>
      <button
        type="button"
        className={onPink ? 'nav-contact mono nav-contact--on' : 'nav-contact mono'}
        onClick={() => openCard('contact')}
        tabIndex={onPink ? undefined : -1}
        aria-hidden={!onPink || undefined}
      >
        Contact
      </button>
    </>
  )
}
