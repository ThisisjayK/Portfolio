import { Navigate, Route, Routes, matchPath, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import IndexNav from './components/IndexNav'
import SiteCards from './components/SiteCards'
import TalkLink from './components/TalkLink'
import { CardsProvider, OpenCardOnMount } from './components/Cards'
import Page from './components/Page'
import Home from './pages/Home'
import LetterPage from './pages/LetterPage'
import DishPage from './pages/DishPage'
import NotFound from './pages/NotFound'
import { letterPages } from './content/letters'
import { dishes } from './content/dishes'

// Renamed or dropped pages (letters.ts history), and the old /about and /playground tabs.
const OLD_LINKS: [string, string][] = [
  ['/football', '/arsenal'],
  ['/one-piece', '/ocean'],
  ['/about', '/about-me'],
  ['/plants', '/'],
  ['/running', '/'],
  ['/gaming', '/'],
  ['/playground', '/'],
]

// Every path that isn't the 404 page. The 404 shows no index at all: its one job is the way
// back (Jayanth, 2026-10-19).
const KNOWN = [
  '/',
  '/contact',
  ...letterPages.map((p) => `/${p.slug}`),
  ...dishes.map((d) => `/cooking/${d.key}`),
  ...OLD_LINKS.map(([from]) => from),
]

export default function App() {
  const location = useLocation()
  const lost = !KNOWN.some((path) => matchPath(path, location.pathname))

  return (
    // LazyMotion keeps Motion's bundle small; reducedMotion="user" follows the OS setting.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <CardsProvider>
        {/* The bottom-left Contact (Nav.tsx) is off every screen since 2026-10-17 (Jayanth); the file
            is kept. Contact is the index's "Say hi", the blue screen's button and the Ask box. */}
        {/* Outside the routed pages, so it stays still while they change. */}
        {!lost && <IndexNav />}
        <SiteCards />
        <TalkLink />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            {/* Contact is a card; old /contact links open it over the home page. */}
            <Route path="/contact" element={<Page><OpenCardOnMount name="contact"><Home /></OpenCardOnMount></Page>} />
            {/* One page per clickable letter of the hero's A–Z (src/content/letters.ts). */}
            {letterPages.map((p) => (
              <Route key={p.slug} path={`/${p.slug}`} element={<Page><LetterPage page={p} /></Page>} />
            ))}
            {/* One page per dish on the cooking menu (src/content/dishes.ts). */}
            {dishes.map((d) => (
              <Route key={d.key} path={`/cooking/${d.key}`} element={<Page><DishPage dish={d} /></Page>} />
            ))}
            {/* Old links that used to work go where their page lives now (2026-10-19). */}
            {OLD_LINKS.map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            {/* Anything else: the "Lost at sea" 404 page (Jayanth, 2026-10-19; was Home). */}
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </AnimatePresence>
        </CardsProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
