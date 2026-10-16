import { intro, favorites, whatIDo, links } from '../content/about'
import HeadLid from '../components/HeadLid'
import './About.css'

export default function About() {
  return (
    <>
      <section className="about" aria-labelledby="about-title">
        <h1 id="about-title" className="visually-hidden">About Jayanth Kappagantula</h1>
        <p className="display about-year about-year--top" aria-hidden="true">20</p>
        <div className="about-face">
          <HeadLid />
        </div>
        <ul className="mono about-list about-list--top" aria-label="A few of my favorite things">
          {favorites.map((f) => <li key={f}>{f}</li>)}
        </ul>
        <div className="intro">
          <h2 className="intro-headline display">{intro.headline}</h2>
          <p>{intro.body.join(' ')}</p>
          <div className="intro-actions">
            <a className="btn" href={links.email}>Email me</a>
            <a className="btn btn--ghost" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <p className="display about-year about-year--bottom" aria-hidden="true">02</p>
        <ul className="mono about-list about-list--bottom" aria-label="What I do">
          {whatIDo.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </section>

    </>
  )
}
