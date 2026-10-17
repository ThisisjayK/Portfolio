// The clickable letters of the hero's A–Z. Each one opens its own page at /<slug>
// (Jayanth, 2026-10-17, after aiu.is). Title, line and doodle come from notes.ts
// (about-me.md §1b). Longer page text is Jayanth's to write, in `more`; until then it holds
// Lorem ipsum filler (below), never invented text about Jayanth.
import { notes, type Note } from './notes'

export type LetterPage = {
  letter: string
  slug: string
  topic: string
  note: Note
  more: string[]
}

// PLACEHOLDER (Jayanth asked for filler, 2026-10-17): standard Lorem ipsum, so it can't be
// mistaken for facts about Jayanth. Replace each page's `more` with Jayanth's own paragraphs.
const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
  'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum qui dolorem.',
]
// Each page starts the filler at a different paragraph, so the pages don't look identical.
const filler = (i: number) => LOREM.map((_, k) => LOREM[(k + i) % LOREM.length])

// Alphabetical.
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

export const letterPages: LetterPage[] = ENTRIES.map(([letter, slug, topic, noteKey], i) => ({
  letter,
  slug,
  topic,
  note: notes.find((n) => n.key === noteKey)!,
  more: filler(i), // PLACEHOLDER: replace with Jayanth's text
}))

export const letterPageFor = (letter: string) => letterPages.find((p) => p.letter === letter)

// The eight-font mix shared by the A–Z and the letter pages (tokens --font-letter-*).
export const LETTER_FONTS = [
  'bold-1', 'bold-2', 'italic-1', 'italic-2', 'sans-1', 'sans-2', 'serif-1', 'serif-2',
] as const
export type LetterFont = (typeof LETTER_FONTS)[number]
