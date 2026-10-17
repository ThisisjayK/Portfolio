// The Work and Contact cards. Copy uses only lines Jayanth has confirmed; the full
// case study (with the lines still under review) comes later.
import { useState } from 'react'
import TissueCard from './TissueCard'
import { useCards } from './Cards'
import { links } from '../content/about'

const SITE_URL = 'https://thisisjayk.github.io/Portfolio/'

export default function SiteCards() {
  const { card, closeCard } = useCards()
  return (
    <>
      <TissueCard open={card === 'work'} title="Work" onClose={closeCard}>
        <WorkCard />
      </TissueCard>
      <TissueCard open={card === 'contact'} title="Contact" onClose={closeCard}>
        <ContactCard />
      </TissueCard>
    </>
  )
}

function WorkCard() {
  return (
    <>
      <span className="mono meta">Case study · Technical PM co-op · Aug–Dec 2025</span>
      <h2 className="display">Stage Zero Health</h2>
      <p>
        I joined an early cancer detection startup as a technical product manager co-op and worked across the
        whole breast cancer journey, from discovery to a paid pilot.
      </p>
      <ul>
        <li>In customer interviews, people were aware of their health, but most were skeptical of digital health.</li>
        <li>I proposed calm, non-alarming risk scores, with links to original sources wherever people needed to check.</li>
        <li>I wrote the requirements, designed the wireframes and tested them with users.</li>
        <li>Most users were over 40 and struggled to find the links, so we reworked focus, raised contrast and made every tap target 44 px.</li>
        <li>We shipped to the waitlist and beta cohorts, then ran a 6-week paid pilot.</li>
      </ul>
      <p className="mono">Full case study coming soon</p>
    </>
  )
}

function ContactCard() {
  const [copied, setCopied] = useState('')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setCopied('Copied. Thank you, genuinely.')
    } catch {
      setCopied(SITE_URL)
    }
  }
  return (
    <>
      <span className="mono meta">Atlanta, GA · Open to full-time PM roles across the US</span>
      <h2 className="display">Say hi.</h2>
      <div className="tissue-links">
        <a href={links.email}>
          <span>{links.email.replace('mailto:', '')}</span>
          <span className="mono">Email</span>
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">
          <span>in/jayanth-kappagantula</span>
          <span className="mono">LinkedIn</span>
        </a>
        <a href={links.github} target="_blank" rel="noreferrer">
          <span>github.com/ThisisjayK</span>
          <span className="mono">GitHub</span>
        </a>
        <span aria-disabled="true">
          <span>Résumé (PDF)</span>
          <span className="mono">Soon</span>
        </span>
      </div>
      <p>Not hiring right now? If you know someone who is, passing this along would mean a lot.</p>
      <button type="button" className="btn btn--ink" onClick={copy}>
        Copy my portfolio link
      </button>
      <p className="mono" role="status" aria-live="polite" style={{ marginTop: 'var(--space-3)', minHeight: '1.5em' }}>
        {copied}
      </p>
    </>
  )
}
