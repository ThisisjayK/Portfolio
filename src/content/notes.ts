// One short note per interest, used by the letter pages (src/content/letters.ts). Text comes
// from about-me.md 1b (Jayanth's own words, 2026-10-16). Bodies are short on purpose until
// Jayanth writes more; nothing here is invented. The doodles (src/assets/doodles/) are no
// longer shown, so they aren't imported (2026-10-17).

export type Note = {
  key: string
  title: string
  body: string
}

export const notes: Note[] = [
  { key: 'arsenal', title: 'London is red', body: 'Gooner, raised on Invincibles highlights.' },
  { key: 'drake', title: 'Drizzy', body: 'Drizzy fan since Take Care.' },
  { key: 'cooking', title: 'Kitchen experiments', body: 'Always experimenting in the kitchen.' },
  // TODO(Jayanth): football has no line of its own yet (it was folded into Arsenal).
  { key: 'football', title: 'Football', body: 'London is red.' },
  { key: 'plants', title: 'Indoor jungle', body: 'Full-time indoor jungle dad.' },
  { key: 'gaming', title: 'High scores', body: 'Chasing high scores.' },
  { key: 'anime', title: 'Gomu Gomu', body: 'Gomu Gomu. One Piece.' },
  { key: 'running', title: 'Weekly mileage', body: 'Actively building weekly mileage.' },
]
