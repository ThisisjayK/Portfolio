import { NavLink } from 'react-router-dom'
import './Nav.css'

const tabs = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/playground', label: 'Playground' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <header className="nav mono">
      <NavLink to="/" className="nav-name">Jayanth K.</NavLink>
      <nav aria-label="Main">
        <ul>
          {tabs.map((t) => (
            <li key={t.to}>
              <NavLink to={t.to} end={t.end}>{t.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
