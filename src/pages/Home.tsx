import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { intro } from '../content/about'
import './Home.css'

export default function Home() {
  return (
    <>
      <Hero />
      {/* The hero ends on flat pink; the page carries on in the same pink. */}
      <section className="handoff" aria-labelledby="handoff-title">
        <h2 id="handoff-title" className="display handoff-title">{intro.headline}</h2>
        <p className="handoff-lead">
          An engineer by training who moved through enterprise systems into product. Most recently, I
          helped take a cancer detection startup from zero to one.
        </p>
        <div className="handoff-actions">
          <Link className="btn btn--ink" to="/work">See how I work →</Link>
          <Link className="btn btn--outline" to="/about">About me</Link>
          <Link className="btn btn--outline" to="/contact">Say hi</Link>
        </div>
      </section>
    </>
  )
}
