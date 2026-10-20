// NOT MOUNTED since 2026-10-17 (Jayanth: "remove it from the UI, store it in our project"). Kept
// so it can come back: render <Nav /> in App.tsx.
//
// The site has no menu (Jayanth, 2026-10-17: the mark, the menu and the full-screen index were
// removed, along with the About and Playground pages and the Work card). What's left of the nav
// is Contact: once the hero has turned blue it waits at the bottom-left and opens the contact
// card. Letters (and their pages) and the roll box are the navigation now.
import { useCards } from './Cards'
import './Nav.css'

export default function Nav() {
  const { openCard, onPink } = useCards()
  return (
    <button
      type="button"
      className={onPink ? 'nav-contact nav-contact--on' : 'nav-contact'}
      onClick={() => openCard('contact')}
      tabIndex={onPink ? undefined : -1}
      aria-hidden={!onPink || undefined}
    >
      Contact
    </button>
  )
}
