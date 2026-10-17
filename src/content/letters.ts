// The clickable letters of the hero's A–Z. Each one opens its own page at /<slug>
// (Jayanth, 2026-10-17, after aiu.is). Title, line and doodle come from notes.ts
// (about-me.md §1b). Longer page text is Jayanth's to write: add paragraphs to `more`.
// It stays empty until then; nothing here is invented.
import { notes, type Note } from './notes'

export type LetterPage = {
  letter: string
  slug: string
  topic: string
  note: Note
  more: string[]
}

// Alphabetical, which is also the order of the page's previous / next links.
const ENTRIES: [letter: string, slug: string, topic: string, noteKey: string][] = [
  ['A', 'arsenal', 'Arsenal', 'arsenal'],
  ['C', 'cooking', 'Cooking', 'cooking'],
  ['D', 'drake', 'Drake', 'drake'],
  ['F', 'football', 'Football', 'football'],
  ['G', 'gaming', 'Gaming', 'gaming'],
  ['O', 'one-piece', 'One Piece', 'anime'],
  ['P', 'plants', 'Plants', 'plants'],
  ['R', 'running', 'Running', 'running'],
]

export const letterPages: LetterPage[] = ENTRIES.map(([letter, slug, topic, noteKey]) => ({
  letter,
  slug,
  topic,
  note: notes.find((n) => n.key === noteKey)!,
  more: [],
}))

export const letterPageFor = (letter: string) => letterPages.find((p) => p.letter === letter)

// The eight-font mix shared by the A–Z and the letter pages (tokens --font-letter-*).
export const LETTER_FONTS = [
  'bold-1', 'bold-2', 'italic-1', 'italic-2', 'sans-1', 'sans-2', 'serif-1', 'serif-2',
] as const
export type LetterFont = (typeof LETTER_FONTS)[number]
