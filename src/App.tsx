import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import Nav from './components/Nav'
import Page from './components/Page'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Playground from './pages/Playground'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()

  return (
    // LazyMotion keeps Motion's bundle small; reducedMotion="user" follows the OS setting.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Nav />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/work" element={<Page><Work /></Page>} />
            <Route path="/playground" element={<Page><Playground /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            <Route path="*" element={<Page><Home /></Page>} />
          </Routes>
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  )
}
