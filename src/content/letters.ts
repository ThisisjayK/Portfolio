// The clickable letters of the hero's A–Z. Each one opens its own page at /<slug>
// (Jayanth, 2026-10-17, after aiu.is). Title and line come from notes.ts
// (about-me.md §1b). Longer page text is in ARTICLES (about-me.md §1c for interests); a page
// without one holds Lorem ipsum filler (below), never invented text about Jayanth.
import { notes, type Note } from './notes'

export type LetterPage = {
  letter: string
  slug: string
  topic: string // the heading
  subtitle?: string // the subheading, if any
  note?: Note // only the interest pages have one
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
  // About Me, Work and the four interest pages (Jayanth, 2026-10-18): written with Jayanth in
  // chat and approved, from about-me.md §1, §1c, §3, §5. Stage Zero follows the §8 disclosure
  // policy (no counts, no vendors). The family story stays at the one approved line (§6b).
  // No em or en dashes, at Jayanth's request. "[Needs your answer: …]" marks what only
  // Jayanth can supply; it shows on the page until replaced.
  'about-me': {
    topic: 'About me',
    body: [
      "Hi, I'm Jayanth. I'm a product manager in Atlanta, by way of Hyderabad and Boston.",
      'I trained as an electronics and instrumentation engineer, worked on enterprise systems in Pega and Salesforce, then moved into product. I finished an MS in Information Systems at Northeastern in August 2026.',
      "Most recently I was the technical product manager co-op at Stage Zero Health, an early cancer detection startup, where I owned the breast cancer journey end to end. Most of the people I interviewed didn't trust digital health. So we showed risk scores calmly, with links back to the original sources. Then testing showed the real problem: a lot of users couldn't find those links. So we fixed that next.",
      "Cancer has touched my family closely, so healthcare is where I most want to be useful. I'm looking for a full-time product manager role anywhere in the US, and I'm open to other sectors too.",
      "Outside work, I cook every day and make a very good mocktail. I've been a Drake fan since a cousin played me Marvins Room in the summer of 2012. I'm a Gooner because of Mesut Özil. And the ocean is where I feel most at peace.",
      'Hiring, or just want to talk Arsenal? Say hi.',
    ],
  },
  // W · Work, newest first. The NGO entry (Period Society Hyderabad, name from Jayanth 2026-10-19) is
  // last because its dates aren't known; it shows only the role and the name until he sends them.
  work: {
    topic: 'Work',
    body: [
      'Graduate Teaching Assistant, Northeastern University. Jan 2026 to Apr 2026, Boston, MA. TA for Managing Operational Risk for Engineers. I was the main point of contact for graduate engineering students, turning risk frameworks and failure modes into guidance that made sense whatever their background.',
      "Technical Product Manager (Co-op), Stage Zero Health. Aug 2025 to Dec 2025, Cambridge, MA. I owned the breast cancer journey end to end at an early cancer detection startup. I interviewed customers, wrote the requirements, designed wireframes and tested them with users. With our engineers, I built an AI assistant that explained each user's risk results, and I evaluated it for groundedness, tone, safety, accuracy and PHI/PII handling, under HIPAA. It led to a 6-week paid pilot, with weekly user feedback shaping the backlog and pilot users signing off before release.",
      'Pega Developer, Bluevoir. Feb 2024 to Jul 2024, Hyderabad, India. I built a microbial detection and case-management app on Pega that reported to the WHO in real time. I defined the case lifecycle, role-based access and decision rules, built a portal for each type of user, and resolved user issues through tickets.',
      'SDE Intern, FormulaQ Solutions. Nov 2023 to Jan 2024, Hyderabad, India. I built, tested and deployed web pages through Salesforce AppExchange and WordPress. They lifted user engagement 10%.',
      'Pega Business Architect, Bluevoir. Jan 2023 to Jun 2023, Hyderabad, India. I turned HR processes like hiring, onboarding and leave into Pega configurations. The solution architect and product owner signed off my BRDs, and I earned both Pega certifications along the way.',
      'Graphic Designer, Period Society Hyderabad.',
    ],
  },
  // Interests (§1c). The cooking figure is the NSS Time Use Survey 2019 (26.1% of men did any
  // unpaid domestic work, via IndiaSpend), not Jayanth's unverified 6 to 10% cooking figure.
  cooking: {
    topic: 'Cooking',
    body: [
      "Only about a quarter of Indian men do any unpaid housework at all, going by India's 2019 Time Use Survey. I cook every day, and I'm glad to be on that side of the number.",
      'I have my mom to thank for it. As a kid I watched her cook, and over time I started helping: chopping vegetables first, then stirring. She always complained that I stirred when there was no need whatsoever.',
      'MasterChef was my show. I watched it while I ate, almost every day.',
      'When I moved to the US and lived on my own, that was when I started cooking every single day. Some of it has come out delicious. I have also killed a few authentic recipes along the way.',
      "I make a good mocktail too. Some of my dishes are below. Open one to see what goes into it.",
    ],
  },
  drake: {
    topic: 'Drake',
    body: [
      'Summer 2012, back home in Hyderabad. My cousins were visiting from the US, and I asked one of them what he was listening to. He came over, sat down next to me and played Marvins Room. That was the first time I heard Drake\'s voice.',
      "Something about that moment stuck. Over the next few weeks I listened to all of Take Care, and that settled it. (I'll be honest, there was also a lot of Justin Bieber in my life until about 2016.) I've been a huge Drizzy fan ever since. Who doesn't love some Drake? He always turns the party up.",
      'His music has kept inspiring me since. It makes me imaginative, and hopeful about a successful life, a bit of luxury, and peace.',
      "Drake announced the Freeze the World tour, and I'm super excited for it. I've already started saving up.",
      "I've made a few Drake playlists for myself. Two of them are below. Pick one and press play.",
    ],
  },
  // The tab is called "Arsenal F.C" (Jayanth, 2026-10-19; was Football) and lives at /arsenal; it keeps
  // the letter F (for F.C), since A is About me. The match year is left out:
  // Jayanth remembers 2012, the Germany 3 to 1 Belgium game with an Özil goal was Oct 2011.
  arsenal: {
    topic: 'Arsenal F.C',
    body: [
      "I didn't like football as a kid. Most of the game looked like stick figures running after a ball, and goals hardly ever came. The World Cup was the one thing I followed, and I followed it fondly.",
      "Then I watched Germany play Belgium, and a player I didn't know scored. I couldn't have told you his name or his position. I just knew he was my favorite player. It was Mesut Özil.",
      'In 2013 he moved to Arsenal, and that is when I fell for the club. I watched every highlight I could find, including the Invincibles playing some properly good football, and the love only grew.',
      'When we won the Premier League in the 2025/26 season, our first in 22 years, I was more than elated. This season I want the quadruple.',
      // Jayanth, 2026-10-19 (about-me.md §1c). "More than 60,000": he remembers 62k; Boston.com
      // reported more than 64,000 at France vs Norway, so the page uses a figure both support.
      'The World Cup I used to follow from a distance came to the US in 2026, and this time I was part of it. I was a Fan Operations volunteer at Boston Stadium in Foxborough, for every match played there.',
      'I was on the Fan ID team, handing out Fan IDs to fans as they arrived. At France vs Norway, our team handed them to a crowd of more than 60,000.',
      'The best part was the people. Fans from every corner of the world, and a team I loved working with. I met so many amazing people.',
    ],
  },
  ocean: {
    topic: 'The ocean',
    body: [
      'Where do I start. I loved the water as a child. I learned to swim when I was somewhere between 10 and 12. My dad did most of the teaching, though the hours in the pool were mine, and I am really grateful to him for it.',
      "Waterparks, pools, anywhere with water: I feel at home there. My thoughts go still, like ripples settling, and I feel at peace. I'm a Pisces, so maybe that's part of it.",
      'In 2021 I went on a trip with friends to Chirala, a town on the Bay of Bengal coast in Andhra Pradesh. That was the first time I swam out well past the shoreline. My parents panicked when I told them afterwards.',
      'I remember floating there, the waves gently moving over me, looking up at the sky. Life has never felt more peaceful than that.',
      'In 2024 I went to Thailand with my friends. It was my first time snorkelling.',
      'I saw beautiful fish and baby tiger sharks, out at the Phi Phi Islands.',
      "I've always been pulled toward water. I can't fully put it into words. The closest I get is peace, and trust me, it's more than that.",
    ],
  },
}

// Each page starts the filler at a different paragraph, so the pages don't look identical.
const filler = (i: number) => LOREM.map((_, k) => LOREM[(k + i) % LOREM.length])

// Alphabetical.
const ENTRIES: [letter: string, slug: string, topic: string, noteKey?: string][] = [
  // A was Arsenal; it holds the about-me article now (Jayanth, 2026-10-17).
  ['A', 'about-me', 'About me', 'arsenal'],
  ['C', 'cooking', 'Cooking', 'cooking'],
  ['D', 'drake', 'Drake', 'drake'],
  ['F', 'arsenal', 'Arsenal F.C', 'football'],
  // O was One Piece; it's the ocean now. Plants (P), running (R) and gaming (G) are
  // dropped from the interests (Jayanth, 2026-10-18).
  ['O', 'ocean', 'The ocean'],
  // W is Work, listed under About in the index (Jayanth, 2026-10-18). No note: it's an article.
  ['W', 'work', 'Work'],
]

export const letterPages: LetterPage[] = ENTRIES.map(([letter, slug, topic, noteKey], i) => {
  const note = noteKey ? notes.find((n) => n.key === noteKey) : undefined
  const article = ARTICLES[slug]
  return {
    letter,
    slug,
    topic: article?.topic ?? topic,
    subtitle: article ? article.subtitle : note?.title,
    note,
    // An article replaces the note's one line; otherwise the line, then PLACEHOLDER filler.
    body: article?.body ?? [note?.body ?? '', ...filler(i)],
  }
})

export const letterPageFor = (letter: string) => letterPages.find((p) => p.letter === letter)

// The eight-font mix shared by the A–Z and the letter pages (tokens --font-letter-*).
export const LETTER_FONTS = [
  'bold-1', 'bold-2', 'italic-1', 'italic-2', 'sans-1', 'sans-2', 'serif-1', 'serif-2',
] as const
export type LetterFont = (typeof LETTER_FONTS)[number]
