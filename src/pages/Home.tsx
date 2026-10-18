import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCards } from '../components/Cards'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import Hero from '../components/Hero'
import ScrollText from '../components/ScrollText'
import RollingRoad from '../components/RollingRoad'
import RackFocus from '../components/RackFocus'
import AskBox from '../components/AskBox'
import './Home.css'

const LEAD =
  'An engineer by training who moved through enterprise systems into product. Most recently, I helped take a cancer detection startup from zero to one.'

export default function Home() {
  const track = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { openCard } = useCards()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  // Pinned on pink: the sentence assembles word by word with the scroll, then the buttons arrive.
  const lead = useTransform(scrollYProgress, [0, 0.55], [0, 1])
  const actionsOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])
  const actionsY = useTransform(scrollYProgress, [0.55, 0.75], [16, 0])

  return (
    <>
      <Hero />
      {/* The hero ends on flat pink; the page carries on in the same pink. */}
      <section ref={track} className={reduced ? 'handoff handoff--static' : 'handoff'} aria-label="Introduction, continued">
        <div className="handoff-stage">
          {reduced ? (
            <p className="handoff-lead">{LEAD}</p>
          ) : (
            <ScrollText className="handoff-lead" text={LEAD} progress={lead} splitBy="word" overlap={0.3} />
          )}
          <m.div className="handoff-actions" style={reduced ? undefined : { opacity: actionsOpacity, y: actionsY }}>
            <Link className="btn btn--ink" to="/about-me">About me →</Link>
            <button type="button" className="btn btn--outline" onClick={() => openCard('contact')}>Say hi</button>
          </m.div>
        </div>
      </section>
      {/* Still on the blue: the rolling blob, the rack focus, then the Ask box (2026-10-17). */}
      <RollingRoad />
      <RackFocus />
      <AskBox />
    </>
  )
}
