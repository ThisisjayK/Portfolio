// Drake things Jayanth owns, shown at the end of the Drake page (2026-10-19): the book, the OVO
// owl chain and the Nocta shoes. The chain picture is a product photo of the silver OVO owl
// pendant (not Jayanth's own photo), cut out and shown flat; the shoes are Jayanth's own
// photo, cut out (2026-10-19; the four product-photo angles and the turning viewer were dropped
// at his request; ShoeSpin was deleted). Details name only what the pictures show.
import titlesRuinEverythingCover from '../assets/drake/titles-ruin-everything-cover.webp'
import titlesRuinEverythingBack from '../assets/drake/titles-ruin-everything-back.webp'
import titlesRuinEverythingSpine from '../assets/drake/titles-ruin-everything-spine.webp'
import noctaShoe from '../assets/drake/nocta-shoe.webp'
import ovoOwlChain from '../assets/drake/ovo-owl-silver-chain.webp'

// `spin`: show the picture as a floating, turning 3D book (Book3D) instead of a flat image.
export type Artifact = { name: string; detail: string; img: string; alt: string; spin?: { back: string; spine: string } }

export const artifacts: Artifact[] = [
  {
    name: 'Titles Ruin Everything',
    detail: 'Aubrey Graham & Kenza Samir · Phaidon',
    img: titlesRuinEverythingCover, // flat front cover, straightened from Jayanth's photo
    spin: { back: titlesRuinEverythingBack, spine: titlesRuinEverythingSpine }, // from the publisher's mock-up, recoloured
    alt: 'The blue cover of Titles Ruin Everything, A Stream of Consciousness by Aubrey Graham and Kenza Samir, published by Phaidon',
  },
  {
    name: 'OVO owl chain',
    detail: 'Silver rope chain, outline owl',
    img: ovoOwlChain,
    alt: 'An OVO owl pendant in silver outline with two small stones for eyes, on a silver rope chain',
  },
  {
    name: 'Nocta shoes',
    detail: 'White, with reflective laces',
    img: noctaShoe,
    alt: 'A white Nocta sneaker with reflective laces, seen from below, worn with black trousers',
  },
]
