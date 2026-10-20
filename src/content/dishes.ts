// The cooking page's menu (Jayanth, 2026-10-18): dishes Jayanth cooked, photographed by him,
// backgrounds removed (src/assets/cooking/). All seven are cartoon versions (the dal was removed
// from the menu, Jayanth, 2026-10-19): bhelpuri, spaghetti,
// cauliflower, the paneer wrap, the burger, the watermelon cocktail and the lemonade (Jayanth, 2026-10-18;
// plate rims rebuilt where the source cut them off, sources in design/cooking-cartoon/).
// Names are Jayanth's own. Each dish has its own page at /cooking/<key> (DishPage) showing the
// picture with its ingredients labelled (Jayanth, 2026-10-19: no recipe or backstory).
// Ingredients (Claude, 2026-10-19, at Jayanth's request): only what can be seen in each picture,
// named the way published recipes for the dish name them. Not checked against what Jayanth
// actually used, so he should correct anything that's wrong. Corrected by Jayanth (2026-10-19):
// the spaghetti is cooked in extra virgin olive oil; the cauliflower is seasoned with salt and
// chilli powder and dressed in melted butter; the bhelpuri has tamarind sauce. `at` is the spot in the picture,
// in % of its width and height; `side` is where the label sits. Sources:
// - Carrettiera: thepetitecook.com/spaghetti-alla-carrettiera, ditalia.com (recipes)
// - Bhel puri: sanjeevkapoor.com, indianhealthyrecipes.com (recipe pages)
// - Black bean burger: zenandspice.com (cheddar-stuffed black bean burgers)
// - Watermelon and Jameson: jamesonwhiskey.com (Watermelon Cooler)
// - Strawberry lemonade: thecrumbykitchen.com (strawberry mint lemonade)
// - Cauliflower steak and mash, paneer wrap: no single standard recipe; named from the picture.
import spaghetti from '../assets/cooking/spaghetti-carrettiera.webp'
import cauliflowerMash from '../assets/cooking/cauliflower-mash.webp'
import paneerWrap from '../assets/cooking/paneer-wraps.webp'
import blackBeanBurger from '../assets/cooking/black-bean-burger.webp'
import watermelonJameson from '../assets/cooking/watermelon-jameson.webp'
import strawberryLemonade from '../assets/cooking/strawberry-lemonade.webp'
import bhelpuri from '../assets/cooking/bhelpuri.webp'

export type Ingredient = { item: string; note: string; at: [number, number]; side: 'left' | 'right' }
export type Dish = {
  key: string
  name: string
  img: string
  ingredients?: Ingredient[]
}

export const dishes: Dish[] = [
  { key: 'spaghetti-carrettiera', name: 'Sicilian-style spaghetti alla carrettiera', img: spaghetti, ingredients: [
    { item: 'Spaghetti', note: 'Cooked in extra virgin olive oil', at: [66, 42], side: 'right' },
    { item: 'Garlic', note: 'Whole cloves, the backbone of carrettiera', at: [33, 41], side: 'left' },
    { item: 'Cherry tomatoes', note: 'Halved and soft; optional in some Sicilian versions', at: [47, 58], side: 'left' },
  ] },
  { key: 'cauliflower-mash', name: 'Roasted cauliflower steak and mash', img: cauliflowerMash, ingredients: [
    { item: 'Cauliflower steak', note: 'Seasoned with salt and chilli powder, dressed in melted butter', at: [62, 48], side: 'right' },
    { item: 'Mash', note: 'Spread under the steak', at: [14, 50], side: 'left' },
  ] },
  { key: 'paneer-wrap', name: 'Paneer wrap', img: paneerWrap, ingredients: [
    { item: 'Paneer', note: 'Cubes, seared until golden', at: [52, 40], side: 'right' },
    { item: 'Green bell pepper', note: 'Thin strips, cooked with the paneer', at: [32, 40], side: 'left' },
    { item: 'Red bell pepper', note: 'Strips for sweetness and colour', at: [31, 63], side: 'left' },
    { item: 'Onion', note: 'Sliced and softened', at: [23, 70], side: 'left' },
    { item: 'Creamy sauce', note: 'Drizzled over the filling', at: [70, 62], side: 'right' },
    { item: 'Spinach tortilla', note: 'The green wrap underneath', at: [82, 80], side: 'right' },
  ] },
  { key: 'black-bean-burger', name: 'Black bean patty burger and curly fries', img: blackBeanBurger, ingredients: [
    { item: 'Sesame bun', note: 'Black and white sesame on top', at: [55, 22], side: 'right' },
    { item: 'Pickle', note: 'A long slice under the bun', at: [42, 49], side: 'left' },
    { item: 'Tomato', note: 'A thick slice', at: [62, 53], side: 'right' },
    { item: 'Red onion', note: 'Rings, raw', at: [74, 58], side: 'right' },
    { item: 'Black bean patty', note: 'Mashed black beans, shaped and seared', at: [57, 64], side: 'right' },
    { item: 'Cheddar', note: 'Melted over the patty', at: [63, 72], side: 'right' },
    { item: 'Lettuce', note: 'Under the patty', at: [34, 62], side: 'left' },
    { item: 'Curly fries', note: 'On the side', at: [22, 35], side: 'left' },
  ] },
  { key: 'watermelon-jameson', name: 'Watermelon cocktail with Jameson', img: watermelonJameson, ingredients: [
    { item: 'Watermelon', note: 'Blended, frothy on top', at: [30, 28], side: 'left' },
    { item: 'Mint', note: 'A sprig to finish', at: [62, 56], side: 'right' },
    { item: 'Jameson', note: 'Irish whiskey, mixed into the watermelon', at: [62, 84], side: 'right' },
  ] },
  { key: 'strawberry-lemonade', name: 'Strawberry lemonade', img: strawberryLemonade, ingredients: [
    { item: 'Mint', note: 'Fresh leaves on top', at: [50, 15], side: 'right' },
    { item: 'Lemon', note: 'Slices, for the sour', at: [76, 46], side: 'right' },
    { item: 'Strawberries', note: 'Sliced, steeping in the lemonade', at: [44, 60], side: 'left' },
    { item: 'Lemonade', note: 'Lemon juice, water and sugar', at: [40, 85], side: 'left' },
  ] },
  { key: 'bhelpuri', name: 'Bhelpuri', img: bhelpuri, ingredients: [
    { item: 'Puffed rice', note: 'Murmura, the base, tossed in masala and tamarind sauce', at: [57, 45], side: 'right' },
    { item: 'Tomato', note: 'Finely chopped', at: [38, 50], side: 'left' },
    { item: 'Red onion', note: 'Finely chopped', at: [26, 30], side: 'left' },
    { item: 'Cucumber', note: 'Diced, for crunch', at: [78, 40], side: 'right' },
    { item: 'Peanuts', note: 'Roasted', at: [65, 70], side: 'right' },
    { item: 'Coriander', note: 'Fresh leaves to finish', at: [45, 8], side: 'left' },
  ] },
]

export const dishFor = (key: string) => dishes.find((d) => d.key === key)
