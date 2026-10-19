// The cooking page's menu (Jayanth, 2026-10-18): dishes Jayanth cooked, photographed by him,
// backgrounds removed (src/assets/cooking/). All seven are cartoon versions (the dal was removed
// from the menu, Jayanth, 2026-10-19): bhelpuri, spaghetti,
// cauliflower, the paneer wrap, the burger, the watermelon cocktail and the lemonade (Jayanth, 2026-10-18;
// plate rims rebuilt where the source cut them off, sources in design/cooking-cartoon/).
// Names are Jayanth's own. Each dish has its own page at /cooking/<key> (DishPage). Backstory,
// timing, ingredients and steps are Jayanth's to write; until then the page shows
// "[Needs your answer: …]" in their place, never invented recipe text.
import spaghetti from '../assets/cooking/spaghetti-carrettiera.webp'
import cauliflowerMash from '../assets/cooking/cauliflower-mash.webp'
import paneerWrap from '../assets/cooking/paneer-wraps.webp'
import blackBeanBurger from '../assets/cooking/black-bean-burger.webp'
import watermelonJameson from '../assets/cooking/watermelon-jameson.webp'
import strawberryLemonade from '../assets/cooking/strawberry-lemonade.webp'
import bhelpuri from '../assets/cooking/bhelpuri.webp'

export type Ingredient = { amount?: string; item: string }
export type Dish = {
  key: string
  name: string
  img: string
  backstory?: string[] // paragraphs, in Jayanth's voice
  meta?: string // e.g. "Serves 2 · 30 min"
  ingredients?: Ingredient[]
  steps?: string[]
}

export const dishes: Dish[] = [
  { key: 'spaghetti-carrettiera', name: 'Sicilian-style spaghetti alla carrettiera', img: spaghetti },
  { key: 'cauliflower-mash', name: 'Roasted cauliflower steak and mash', img: cauliflowerMash },
  { key: 'paneer-wrap', name: 'Paneer wrap', img: paneerWrap },
  { key: 'black-bean-burger', name: 'Black bean patty burger and curly fries', img: blackBeanBurger },
  { key: 'watermelon-jameson', name: 'Watermelon cocktail with Jameson', img: watermelonJameson },
  { key: 'strawberry-lemonade', name: 'Strawberry lemonade', img: strawberryLemonade },
  { key: 'bhelpuri', name: 'Bhelpuri', img: bhelpuri },
]

export const dishFor = (key: string) => dishes.find((d) => d.key === key)
