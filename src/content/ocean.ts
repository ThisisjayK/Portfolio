// The Chirala map on the Ocean page (Jayanth, 2026-10-19). Jayanth's own satellite picture of
// South India; the thin circle is drawn by hand-feel round Chirala (Andhra Pradesh, on the Bay of
// Bengal coast, just south-west of the Krishna delta), placed from its coordinates against the
// map's scale bar. It is approximate on purpose: the circle is a few tens of kilometres wide and
// doesn't point at one beach. The label beside it follows the dish pages' ingredient labels.
// Provenance of the picture isn't known (it looks like a map-app or Earth-viewer image): check
// the source's terms before launch.
import southIndia from '../assets/ocean/south-india-satellite.webp'
import snorkel from '../assets/ocean/phi-phi-snorkel.webp'
import thailand from '../assets/ocean/thailand-satellite.webp'

export const chiralaMap = {
  src: southIndia,
  alt: 'A satellite view of South India and Sri Lanka, a thin white circle round Chirala on the east coast',
  width: 1460,
  height: 1444,
  // Circle centre and radius in the picture's own coordinates (1460 x 1444).
  at: [770, 505] as [number, number],
  r: 58,
  circle: 'M736.7,457.5 C749.8,448.4 766.0,444.7 781.6,447.8 C797.3,451.0 811.2,460.3 819.7,473.9 C828.3,487.6 831.2,504.1 827.1,519.8 C823.0,535.4 813.0,549.0 798.8,556.9 C784.5,564.8 767.7,566.8 752.1,561.9 C736.5,557.0 723.3,546.1 716.1,531.3 C708.9,516.5 707.7,499.4 713.5,483.9 C719.3,468.4 731.0,455.7 746.3,449.2',
  label: {
    num: '01',
    name: 'This is where I first swam',
    note: 'Chirala, on the Bay of Bengal. 2021.',
  },
}

// Thailand, the first time snorkelling (Jayanth, 2026-10-19). Both pictures are his; the marks
// he drew on them as a mock-up were removed and redone in the site's style. The snorkelling photo
// is softly blurred everywhere except Jayanth's face (his request, 2026-10-19), so his friends
// aren't identifiable. The trip was in 2024
// (Jayanth, 2026-10-19). "baby tiger sharks" is his description.
export const snorkelPhoto = {
  src: snorkel,
  alt: 'Friends floating in clear turquoise water in orange life jackets, softly blurred except for Jayanth, second from the right, whose face is sharp',
  width: 1500,
  height: 1100,
  // The target is Jayanth's face (wet dark hair, second from the right).
  at: [775, 232] as [number, number],
  r: 72, // the arrow stops this far right of the face (no circle round it, Jayanth 2026-10-19)
  label: { name: "I'm here LOL" },
}

export const phiPhiMap = {
  src: thailand,
  alt: 'A satellite view of southern Thailand and the Andaman Sea, a thin blue circle round the Phi Phi Islands',
  width: 1536,
  height: 1536,
  // Jayanth's own circle, kept where he drew it.
  at: [512, 1050] as [number, number],
  r: 62,
  circle: 'M476.4,999.2 C490.4,989.5 507.7,985.5 524.4,988.9 C541.2,992.3 556.1,1002.2 565.2,1016.8 C574.3,1031.4 577.4,1049.0 573.0,1065.8 C568.7,1082.5 557.9,1097.0 542.7,1105.4 C527.5,1113.9 509.5,1116.1 492.8,1110.8 C476.2,1105.5 462.1,1093.9 454.4,1078.1 C446.7,1062.3 445.4,1044.0 451.6,1027.4 C457.8,1010.9 470.3,997.3 486.7,990.4',
  label: { num: '02', name: 'Phi Phi Islands', note: 'Thailand, 2024. My first time snorkelling.' },
}
