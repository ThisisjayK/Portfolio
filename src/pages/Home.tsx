import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCards } from '../components/Cards'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import Hero from '../components/Hero'
import ScrollText from '../components/ScrollText'
import GlobeRoute from '../components/GlobeRoute'
import RollingRoad from '../components/RollingRoad'
import RackFocus from '../components/RackFocus'
import AskBox from '../components/AskBox'
import RevealText from '../components/RevealText'
import { intro } from '../content/about'
import './Home.css'


export default function Home() {
  const track = useRef<HTMLElement>(null)
  const next = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { openCard } = useCards()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  // Pinned on blue: the education sentence assembles word by word with the scroll.
  const lead = useTransform(scrollYProgress, [0, 0.55], [0, 1])
  const labelOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])
  // What's next: its blurred glows appear slowly as it scrolls in, are full when it fills the
  // screen, and fade away on the way into the Ask box (Jayanth, 2026-10-19). 0 = its top at the
  // bottom of the screen, 1 = its bottom at the top.
  const { scrollYProgress: nextP } = useScroll({ target: next, offset: ['start end', 'end start'] })
  const glowOpacity = useTransform(nextP, [0.1, 0.5, 0.85], [0, 1, 0])
  const glowScale = useTransform(nextP, [0.1, 0.5], [0.85, 1])

  return (
    <>
      <Hero />
      <GlobeRoute />
      {/* The hero ends on flat blue; the page carries on in the same blue. The story in order
          (Jayanth, 2026-10-19): where from on the globe, education here, career on the road, life in the rack focus,
          then what's next with the buttons, then the Ask box. */}
      <section ref={track} className={reduced ? 'handoff handoff--static' : 'handoff'} aria-labelledby="education-title">
        <div className="handoff-stage">
          <m.h2 id="education-title" className="handoff-label" style={reduced ? undefined : { opacity: labelOpacity }}>
            Education
          </m.h2>
          {reduced ? (
            <p className="handoff-lead">{intro.education}</p>
          ) : (
            <ScrollText className="handoff-lead" text={intro.education} progress={lead} splitBy="word" overlap={0.3} />
          )}
        </div>
      </section>
      <RollingRoad />
      <RackFocus />
      <section ref={next} className="next" aria-labelledby="next-title">
        {/* The fading layer stays full size (its mask would cut straight edges if it shrank);
            only the glows inside it grow. */}
        <m.div className="next-glows" aria-hidden="true" style={reduced ? undefined : { opacity: glowOpacity }}>
          <m.div className="next-glows-grow" style={reduced ? undefined : { scale: glowScale }}>
            <div className="next-glow next-glow--a" />
            <div className="next-glow next-glow--b" />
          </m.div>
        </m.div>
        <h2 id="next-title" className="handoff-label">What's next</h2>
        <RevealText as="p" className="next-text" text={intro.next} />
        <div className="handoff-actions">
          <Link className="btn btn--ink" to="/about-me">About me →</Link>
          <button type="button" className="btn btn--outline" onClick={() => openCard('contact')}>Say hi</button>
        </div>
      </section>
      <AskBox />
    </>
  )
}
