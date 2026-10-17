// Things Jayanth loves, shown as paper notes that unfold around the silhouette while the
// hero scrolls. Labels and notes are Jayanth's own wording from about-me.md §1b
// (2026-10-16); only the first letter of the cooking note is capitalised.
import cannon from '../assets/interests/cannon.webp'
import owl from '../assets/interests/owl.webp'
import ramen from '../assets/interests/ramen.webp'
import plant from '../assets/interests/plant.webp'
import controller from '../assets/interests/controller.webp'
import sneaker from '../assets/interests/sneaker.webp'

export type Interest = { label: string; note: string; doodle: string }

export const interests: Interest[] = [
  { label: 'Arsenal', note: 'Gooner, raised on Invincibles highlights', doodle: cannon },
  { label: 'Drake', note: 'Drizzy fan since Take Care', doodle: owl },
  { label: 'Cooking', note: 'Experimenting in the kitchen always', doodle: ramen },
  { label: 'Plants', note: 'Full-time indoor jungle dad', doodle: plant },
  { label: 'Gaming & anime', note: 'Chasing high scores and Gomu Gomu', doodle: controller },
  { label: 'Running', note: 'Actively building weekly mileage', doodle: sneaker },
]
