// "talk: <email>" in small mono type, fixed in the bottom-right corner of every page (Jayanth,
// 2026-10-19; replaces the hero's "Scroll ↓" cue). Outside the routed pages, like the index, so
// it stays still while pages change. White on the blue sections (onPink), blue elsewhere.
import { useCards } from './Cards'
import { links } from '../content/about'
import './TalkLink.css'

export default function TalkLink() {
  const { onPink } = useCards()
  const address = links.email.replace('mailto:', '')
  return (
    <a className={onPink ? 'talk mono talk--on-blue' : 'talk mono'} href={links.email}>
      talk: {address}
    </a>
  )
}
