// Fixed answers for the "Ask about me" box (Jayanth, 2026-10-17: fixed answers now, no AI).
// Every answer comes from about-me.md and names its section. Questions about work
// authorization, salary or start dates are never answered here (their public wording is TBD in
// about-me.md §1); the box points to Contact instead. Anything else unmatched gets no answer.

export type Fact = { keys: string[]; answer: string; source: string }

export const FACTS: Fact[] = [
  {
    keys: ['do', 'role', 'job', 'work', 'who are you', 'what are you'],
    answer:
      "I'm a product manager. Most recently I was a Technical Product Manager co-op at Stage Zero Health, an early cancer detection startup.",
    source: 'about-me.md §3 Experience',
  },
  {
    keys: ['study', 'studied', 'school', 'degree', 'university', 'education', 'master', 'college', 'graduate'],
    answer:
      'An MS in Information Systems at Northeastern University in Boston (2024–2026), and before that a B.Tech in Electronics and Instrumentation Engineering at Keshav Memorial Institute of Technology, Hyderabad (2019–2023).',
    source: 'about-me.md §5 Education',
  },
  {
    keys: ['live', 'based', 'where are you', 'location', 'city', 'remote', 'relocate', 'hybrid'],
    answer: "Atlanta, GA. I'm open to roles anywhere in the US: on-site, remote or hybrid.",
    source: 'about-me.md §1 Basics',
  },
  {
    keys: ['stage zero', 'startup', 'cancer', 'pilot', 'co-op'],
    answer:
      'Zero-to-one work on the breast cancer journey: customer interviews, requirements and PRDs, wireframes in Figma and Miro, testing with users, a 6-week paid pilot, and supporting the founder on launch planning, positioning and pricing.',
    source: 'about-me.md §3 Experience',
  },
  {
    keys: ['tool', 'tools', 'stack', 'software', 'figma', 'jira'],
    answer: 'Jira, Asana, Miro, Notion, Figma, Salesforce, Pega, GitHub, Vercel, Supabase, GA4 and Claude Code.',
    source: 'about-me.md §6 Skills',
  },
  {
    keys: ['language', 'languages', 'speak', 'hindi', 'telugu'],
    answer: 'English, Hindi (fluent) and Telugu (native).',
    source: 'about-me.md §6 Skills',
  },
  {
    keys: ['certif', 'certified', 'pega', 'salesforce'],
    answer: 'Certified Salesforce Administrator, Pega Certified Business Architect and Pega Certified System Architect.',
    source: 'about-me.md §5 Education',
  },
]

// Never answered here: sent to Contact.
export const ASK_DIRECT = ['visa', 'sponsor', ' opt ', 'authoriz', 'authoris', 'h-1b', 'h1b', 'salary', 'compensation', 'start date', 'when can you start', 'citizen', 'green card']

export const SUGGESTIONS = ['What do you do?', 'Where did you study?', 'What did you do at Stage Zero?', 'Where are you based?']

export type Reply = { kind: 'answer'; fact: Fact } | { kind: 'direct' } | { kind: 'none' }

export function answer(question: string): Reply | null {
  const q = ` ${question.toLowerCase().replace(/[?!.,]/g, ' ')} `
  if (!question.trim()) return null
  if (ASK_DIRECT.some((k) => q.includes(k))) return { kind: 'direct' }
  let best: Fact | null = null
  let score = 0
  for (const f of FACTS) {
    // Longer, more specific phrases count for more ("stage zero" beats "do").
    const s = f.keys
      .filter((k) => q.includes(k.length < 4 ? ` ${k} ` : k))
      .reduce((n, k) => n + k.length, 0)
    if (s > score) {
      best = f
      score = s
    }
  }
  return best ? { kind: 'answer', fact: best } : { kind: 'none' }
}
