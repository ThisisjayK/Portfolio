import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import IndexNav from './components/IndexNav'
import SiteCards from './components/SiteCards'
import { CardsProvider, OpenCardOnMount } from './components/Cards'
import Page from './components/Page'
import Home from './pages/Home'
import LetterPage from './pages/LetterPage'
import { letterPages } from './content/letters'

export default function App() {
  const location = useLocation()

  return (
    // LazyMotion keeps Motion's bundle small; reducedMotion="user" follows the OS setting.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <CardsProvider>
        {/* The bottom-left Contact (Nav.tsx) is off every screen since 2026-10-17 (Jayanth); the file
            is kept. Contact is the index's "Say hi", the blue screen's button and the Ask box. */}
        {/* Outside the routed pages, so it stays still while they change. */}
        <IndexNav />
        <SiteCards />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            {/* Contact is a card; old /contact links open it over the home page. Old /work,
                /about and /playground links fall through to the home page below. */}
            <Route path="/contact" element={<Page><OpenCardOnMount name="contact"><Home /></OpenCardOnMount></Page>} />
            {/* One page per clickable letter of the hero's A–Z (src/content/letters.ts). */}
            {letterPages.map((p) => (
              <Route key={p.slug} path={`/${p.slug}`} element={<Page><LetterPage page={p} /></Page>} />
            ))}
            <Route path="*" element={<Page><Home /></Page>} />
          </Routes>
        </AnimatePresence>
        </CardsProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
