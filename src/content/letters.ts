// The clickable letters of the hero's A–Z. Each one opens its own page at /<slug>
// (Jayanth, 2026-10-17, after aiu.is). Title and line come from notes.ts
// (about-me.md §1b). Longer page text is Jayanth's to write, in ARTICLES; until then a page
// holds Lorem ipsum filler (below), never invented text about Jayanth.
import { notes, type Note } from './notes'

export type LetterPage = {
  letter: string
  slug: string
  topic: string // the heading
  subtitle?: string // the subheading, if any
  note: Note
  body: string[] // the paragraphs under the subheading
}

// PLACEHOLDER (Jayanth asked for filler, 2026-10-17): standard Lorem ipsum, so it can't be
// mistaken for facts about Jayanth. Replaced page by page as ARTICLES are written.
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
// Real articles, by slug, written from about-me.md only. A page with an article can also
// replace its heading, and has a subheading only if it sets one. Pages without one keep the
// note's title as subheading, and the filler.
type Article = { topic?: string; subtitle?: string; body: string[] }
const ARTICLES: Record<string, Article> = {
  // A · About me (Jayanth, 2026-10-17), rewritten in the shape portfolio guides recommend: a hook,
  // who I am, what drives me, one real story instead of a list of roles, how I work, life
  // outside work, what's next and a call to action. Facts from about-me.md §1, §1b, §3, §5, §6
  // and the site's existing intro (src/content/about.ts). "[Needs your answer: …]" marks the
  // parts only Jayanth can write; they show on the page until replaced.
  // Kept off on purpose: visa and OPT details, counts and metrics (§8), the fuller family
  // story (§6b, public use TBD), the GPA.
  'about-me': {
    topic: 'About me',
    body: [
      "Most of the people I interviewed at a cancer detection startup didn't trust digital health. [Needs your answer: is this the right opening? It's true, but whether it's what shaped you most is yours to say.] I'm Jayanth Kappagantula, a product manager, and I start with the people using the product.",
      "Cancer has touched my family closely, so healthcare is where I most want to be useful. [Needs your answer: do you want to share more of why, such as your parents caring for your grandparents? Only if you want it public.]",
      "I trained as an engineer, in Electronics and Instrumentation in Hyderabad, and spent my first years in enterprise systems: turning hiring, onboarding and leave into Pega workflows, then building a case-management app for microbial detection that reported to the WHO in real time. [Needs your answer: what made you move from building systems to product?] In 2024 I moved to Boston for a master's in Information Systems at Northeastern.",
      "At Stage Zero Health, working on the breast cancer journey, US healthcare was new to me, and the interviews were a culture shock. People were careful about their health and made deliberate choices, and most of them were skeptical of digital health. So I proposed showing risk scores and recommendations calmly, without alarm, with links to the original data and verified facts behind them. I wrote the requirements, designed the wireframes and tested them with users.",
      "Testing showed me what I'd missed. Most of our users were over 40, and they had trouble finding and opening those links, even though they understood what they read once they got there. So we reworked focus management, improved color contrast and made every click target at least 44 by 44 pixels. The lesson I took: good information isn't enough if people can't get to it.",
      "That job changed how I work. I started taking responsibility more seriously, worked more closely across teams, and learned what it takes to build a company from the ground up. I loved the pace, even when it was messy, because no two days were the same.",
      "[Needs your answer: how do you work? Two or three habits or beliefs in your own words, for example how you run an interview, how you decide what to build first, or how you work with engineers and designers.]",
      "Outside work, I'm a Gooner raised on Invincibles highlights and a Drizzy fan since Take Care. I'm always experimenting in the kitchen, I'm a full-time indoor jungle dad, I'm chasing high scores and Gomu Gomu, and I'm building my weekly mileage.",
      "Now I'm looking for full-time product roles anywhere in the US, and Stage Zero left me curious about insurance and claims. [Needs your answer: what kind of team or problem do you want next?] If that sounds like your team, say hi.",
    ],
  },
}

// Each page starts the filler at a different paragraph, so the pages don't look identical.
const filler = (i: number) => LOREM.map((_, k) => LOREM[(k + i) % LOREM.length])

// Alphabetical.
const ENTRIES: [letter: string, slug: string, topic: string, noteKey: string][] = [
  // A was Arsenal; it holds the about-me article now (Jayanth, 2026-10-17).
  ['A', 'about-me', 'About me', 'arsenal'],
  ['C', 'cooking', 'Cooking', 'cooking'],
  ['D', 'drake', 'Drake', 'drake'],
  ['F', 'football', 'Football', 'football'],
  ['G', 'gaming', 'Gaming', 'gaming'],
  ['O', 'one-piece', 'One Piece', 'anime'],
  ['P', 'plants', 'Plants', 'plants'],
  ['R', 'running', 'Running', 'running'],
]

export const letterPages: LetterPage[] = ENTRIES.map(([letter, slug, topic, noteKey], i) => {
  const note = notes.find((n) => n.key === noteKey)!
  const article = ARTICLES[slug]
  return {
    letter,
    slug,
    topic: article?.topic ?? topic,
    subtitle: article ? article.subtitle : note.title,
    note,
    // An article replaces the note's one line; otherwise the line, then PLACEHOLDER filler.
    body: article?.body ?? [note.body, ...filler(i)],
  }
})

export const letterPageFor = (letter: string) => letterPages.find((p) => p.letter === letter)

// The eight-font mix shared by the A–Z and the letter pages (tokens --font-letter-*).
export const LETTER_FONTS = [
  'bold-1', 'bold-2', 'italic-1', 'italic-2', 'sans-1', 'sans-2', 'serif-1', 'serif-2',
] as const
export type LetterFont = (typeof LETTER_FONTS)[number]
