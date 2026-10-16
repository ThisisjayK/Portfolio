// The things inside the head, in the order they fly out. Text comes from about-me.md 1b
// (Jayanth's own words, 2026-10-16). Bodies are short on purpose until Jayanth writes more;
// nothing here is invented.
import cannon from '../assets/doodles/cannon.webp'
import owl from '../assets/doodles/owl.webp'
import ramen from '../assets/doodles/ramen.webp'
import football from '../assets/doodles/football.webp'
import plant from '../assets/doodles/plant.webp'
import controller from '../assets/doodles/controller.webp'
import strawhat from '../assets/doodles/strawhat.webp'
import sneaker from '../assets/doodles/sneaker.webp'

export type Note = {
  key: string
  doodle: string
  doodleAlt: string
  title: string
  body: string
}

export const notes: Note[] = [
  { key: 'arsenal', doodle: cannon, doodleAlt: 'Arsenal cannon', title: 'London is red', body: 'Gooner, raised on Invincibles highlights.' },
  { key: 'drake', doodle: owl, doodleAlt: 'OVO owl', title: 'Drizzy', body: 'Drizzy fan since Take Care.' },
  { key: 'cooking', doodle: ramen, doodleAlt: 'Bowl of ramen', title: 'Kitchen experiments', body: 'Always experimenting in the kitchen.' },
  // TODO(Jayanth): football has no line of its own yet (it was folded into Arsenal).
  { key: 'football', doodle: football, doodleAlt: 'Football', title: 'Football', body: 'London is red.' },
  { key: 'plants', doodle: plant, doodleAlt: 'Potted plant', title: 'Indoor jungle', body: 'Full-time indoor jungle dad.' },
  { key: 'gaming', doodle: controller, doodleAlt: 'PS5 controller', title: 'High scores', body: 'Chasing high scores.' },
  { key: 'anime', doodle: strawhat, doodleAlt: 'Straw Hat Pirates flag', title: 'Gomu Gomu', body: 'Gomu Gomu. One Piece.' },
  { key: 'running', doodle: sneaker, doodleAlt: 'Running shoe', title: 'Weekly mileage', body: 'Actively building weekly mileage.' },
]
