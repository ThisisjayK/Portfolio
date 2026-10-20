// The Contact card (the Work card was removed, Jayanth, 2026-10-17). Copy uses only lines
// Jayanth has confirmed.
import { useState } from 'react'
import TissueCard from './TissueCard'
import { useCards } from './Cards'
import { links } from '../content/about'

const SITE_URL = 'https://thisisjayk.github.io/Portfolio/'

export default function SiteCards() {
  const { card, closeCard } = useCards()
  return (
    <>
      <TissueCard open={card === 'contact'} title="Contact" onClose={closeCard}>
        <ContactCard />
      </TissueCard>
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
        {/* The résumé is live (public/resume.pdf, 2026-10-19); was a "Soon" placeholder. */}
        <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noopener">
          <span>Résumé (PDF)</span>
          <span className="mono">Open</span>
        </a>
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
