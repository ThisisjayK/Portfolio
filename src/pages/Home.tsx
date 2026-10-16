import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import TextReveal from '../components/TextReveal'
import './Home.css'

export default function Home() {
  return (
    <>
      <Hero />
      {/* The hero ends on flat pink; the page carries on in the same pink. */}
      <section className="handoff" aria-label="Introduction, continued">
        <TextReveal
          className="handoff-lead"
          splitBy="word"
          y={20}
          blur={6}
          stagger={0.03}
          delay={0.45}
          text="An engineer by training who moved through enterprise systems into product. Most recently, I helped take a cancer detection startup from zero to one."
        />
        <div className="handoff-actions">
          <Link className="btn btn--ink" to="/work">See how I work →</Link>
          <Link className="btn btn--outline" to="/about">About me</Link>
          <Link className="btn btn--outline" to="/contact">Say hi</Link>
        </div>
      </section>
    </>
  )
}
