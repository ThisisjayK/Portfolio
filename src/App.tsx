import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import Nav from './components/Nav'
import SiteCards from './components/SiteCards'
import { CardsProvider, OpenCardOnMount } from './components/Cards'
import Page from './components/Page'
import Home from './pages/Home'
import About from './pages/About'
import Playground from './pages/Playground'

export default function App() {
  const location = useLocation()

  return (
    // LazyMotion keeps Motion's bundle small; reducedMotion="user" follows the OS setting.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <CardsProvider>
        <Nav />
        <SiteCards />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            {/* Work and Contact are cards now; old links open the card over the home page. */}
            <Route path="/work" element={<Page><OpenCardOnMount name="work"><Home /></OpenCardOnMount></Page>} />
            <Route path="/playground" element={<Page><Playground /></Page>} />
            <Route path="/contact" element={<Page><OpenCardOnMount name="contact"><Home /></OpenCardOnMount></Page>} />
            <Route path="*" element={<Page><Home /></Page>} />
          </Routes>
        </AnimatePresence>
        </CardsProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
