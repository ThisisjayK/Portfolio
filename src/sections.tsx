import { useEffect, useMemo, useState } from "react"
// InfiniteMenu is authored in JS (React Bits); no type declaration ships with
// it, and we do not run tsc in the build.
// @ts-expect-error - JS component, no type declaration
import InfiniteMenu from "./InfiniteMenu"
// @ts-expect-error - JS component, no type declaration
import CircularGallery from "./CircularGallery"
// Two logo tiles (transparent background) in each theme's ink colour, so the
// wordmark stays legible over the page's pink (light) / green (dark) paper.
import kickGreen from "./assets/kick-green.svg"
import kickPink from "./assets/kick-pink.svg"
// Case-study cover art lives with its source documents under case-studies/,
// not in src/assets, so the write-up and its artwork stay in one folder.
import stageZeroGreen from "../case-studies/stage-zero-health/assets/cover-green.svg"
import stageZeroPink from "../case-studies/stage-zero-health/assets/cover-pink.svg"
// Shared placeholders for the slots that have no write-up yet. They live in
// src/assets rather than a case-study folder because they belong to no project.
import soonCardGreen from "./assets/soon-card-green.svg"
import soonCardPink from "./assets/soon-card-pink.svg"
import soonTileGreen from "./assets/soon-tile-green.svg"
import soonTilePink from "./assets/soon-tile-pink.svg"
// Certification badge logos, shown as the papers inside the Folder on the
// Certifications tab. The Pega badges have had their version number removed.
import certAdministrator from "./assets/Administrator.svg"
import certBusinessArchitect from "./assets/BA.svg"
import certSystemArchitect from "./assets/SA.svg"
// @ts-expect-error - JS component (React Bits), no type declaration
import Folder from "./Folder"

// Reads the current theme off <html data-theme> and re-renders when it flips.
function useThemeName(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
  )
  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() =>
      setTheme(el.getAttribute("data-theme") === "light" ? "light" : "dark"),
    )
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] })
    return () => obs.disconnect()
  }, [])
  return theme
}

/* Section content. Copy is ported verbatim from the static site; the bracketed
   text and the {/* TODO *​/} notes mark what Jay still needs to fill in. No em
   dashes anywhere, per house style. */

export function About() {
  return (
    <section className="hero">
      <h1 className="about-name">Hey, I&apos;m Jayanth</h1>
      <div className="cols">
        <div>
          <p className="lede">
            An early-career product manager who spent five months as a
            technical PM intern at a pre-seed B2B startup near MIT building early
            cancer detection tech. Small team, real stakes, no room to hide behind
            process for its own sake.
          </p>
          <p>
            What that actually meant day to day: writing PRDs that engineers could
            work from without guessing, running sprint planning and backlog
            grooming, and sitting in on bug triage when something customer-facing
            broke. I got comfortable using frameworks like RICE and Kano to decide
            what actually mattered this sprint versus what just felt urgent, and I
            ran user interviews trying hard not to lead the witness toward the
            answer I wanted to hear.
          </p>
        </div>
        <div className="aside">
          <p>
            I&apos;m looking for an APM or new-grad product role where the problems
            are real enough that I can&apos;t fake my way through them.
          </p>
          <p style={{ marginBottom: 0 }}>
            Outside of work I garden, cook, sing, and watch more anime than
            I&apos;ll admit to in an interview.
          </p>
        </div>
      </div>
    </section>
  )
}

// One card per case study. `id` is what Work hands back on click so App knows
// which page to open; the remaining cards are still placeholders and open
// nothing until their write-ups exist.
export type CaseId = "stage-zero"

const CASE_CARDS: { id: CaseId | null; green: string; pink: string }[] = [
  { id: "stage-zero", green: stageZeroGreen, pink: stageZeroPink },
]

// Empty slots, drawn in the same two inks rather than borrowed stock photos, so
// the carousel reads as "one study written, more on the way" instead of showing
// artwork for pieces that do not exist. They carry no id and so open nothing.
const PLACEHOLDER_COUNT = 3

// The props default to {} so the component still satisfies the prop-less
// signature the SECTIONS map in App.tsx is typed against.
export function Work({ onOpenCase }: { onOpenCase?: (id: CaseId) => void } = {}) {
  const theme = useThemeName()

  // Preload both ink variants so flipping the theme swaps the cover from cache
  // rather than leaving the card blank while the new file decodes.
  useEffect(() => {
    ;[stageZeroGreen, stageZeroPink, soonCardGreen, soonCardPink].forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Memoised so the gallery only rebuilds its WebGL context when the theme
  // (and therefore the artwork) actually changes.
  //
  // Note the inversion against the rest of the site: covers are named for their
  // ink, and each theme takes the ink it is NOT printed in, so the card reads as
  // paper laid on the page rather than a hole cut in it. Dark mode (green page)
  // gets the pink card with green type, light mode gets the green card.
  const items = useMemo(
    () => [
      ...CASE_CARDS.map((c) => ({
        image: theme === "dark" ? c.green : c.pink,
        text: "",
        id: c.id,
      })),
      ...Array.from({ length: PLACEHOLDER_COUNT }, () => ({
        image: theme === "dark" ? soonCardGreen : soonCardPink,
        text: "",
        id: null,
      })),
    ],
    [theme],
  )

  return (
    <section className="block">
      <div className="case-gallery">
        <CircularGallery
          items={items}
          bend={1.5}
          borderRadius={0.05}
          scrollEase={0.05}
          scrollSpeed={6.5}
          font="bold 28px Geist"
          onItemClick={(_i: number, item: { id: CaseId | null }) => {
            if (item?.id) onOpenCase?.(item.id)
          }}
        />
      </div>
    </section>
  )
}

// Props default to {} for the same reason as Work above: the SECTIONS map in
// App.tsx is typed against a prop-less signature.
export function Teardowns({ onOpenKick }: { onOpenKick?: () => void } = {}) {
  const theme = useThemeName()

  // Preload both theme variants once so a theme flip swaps the logo from cache
  // instead of triggering a fresh network/decode, which is what left the sphere
  // briefly blank while the new logo loaded.
  useEffect(() => {
    ;[kickGreen, kickPink, soonTileGreen, soonTilePink].forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // One entry per product torn down, plus a placeholder face so the sphere has
  // something to rotate between while there is only one teardown written. No
  // title/description by design (logos only). `id` is what the click handler
  // reads: only the kick face opens anything. Memoised so InfiniteMenu re-inits
  // only when the theme (and thus the artwork) actually changes.
  const items = useMemo(
    () => [
      {
        id: "kick",
        image: theme === "dark" ? kickPink : kickGreen,
        link: "kick/",
        title: "",
        description: "",
      },
      {
        id: "soon",
        image: theme === "dark" ? soonTilePink : soonTileGreen,
        link: "",
        title: "",
        description: "",
      },
    ],
    [theme],
  )

  return (
    <section className="block">
      <div className="teardown-sphere">
        <InfiniteMenu
          items={items}
          onItemClick={(item: { id?: string }) => {
            if (item?.id === "kick") onOpenKick?.()
          }}
        />
      </div>
    </section>
  )
}

/* Three groups so the existing .par grid (three equal columns) holds them
   without new layout CSS; the chips reuse .meta span from the teardown list.
   Everything listed here is drawn from work Jay has actually described rather
   than a generic PM skills inventory, so it stays defensible in an interview. */
const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Product",
    items: [
      "PRDs & specs",
      "User stories",
      "Roadmap & backlog",
      "Two-week sprints",
      "Bug triage",
      "RICE",
      "Prototyping",
    ],
  },
  {
    group: "Research & discovery",
    items: [
      "User interviews",
      "Survey & interview synthesis",
      "Personas",
      "Journey mapping",
      "TAM / SAM / SOM",
      "Market research",
      "Product teardowns",
    ],
  },
  {
    group: "Technical & tools",
    items: [
      "API contracts",
      "Risk-model integration",
      "Change API",
      "GA4",
      "Jira",
      "Asana",
      "Miro",
      "Figma",
      "Twilio",
      "SendGrid",
      "Customer.io",
      "Claude Code",
      "Notion",
      "Microsoft Excel",
    ],
  },
]

export function Skills() {
  return (
    <section className="block">
      <div className="par">
        {SKILLS.map((s) => (
          <div className="step" key={s.group}>
            <span className="k">{s.group}</span>
            <div className="meta">
              {s.items.map((i) => (
                <span key={i}>{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Each cert becomes a "paper" inside the Folder; clicking a paper opens the
// verification link in a new tab. Order here is the paper order in the folder.
const CERTS: { name: string; logo: string; url: string }[] = [
  {
    name: "Salesforce Certified Administrator",
    logo: certAdministrator,
    url: "https://drive.google.com/file/d/1zJwCtzYG59lxit3OlVjd1OXvdC8DSHO5/view?usp=drive_link",
  },
  {
    name: "Pega Certified Business Architect",
    logo: certBusinessArchitect,
    url: "https://drive.google.com/file/d/12JBSuowHIw9UP8M_LhVqcKdovTqa9nqN/view?usp=drive_link",
  },
  {
    name: "Pega Certified System Architect",
    logo: certSystemArchitect,
    url: "https://drive.google.com/file/d/1WVVU-VpT7sWHzP9OFwQ54xmHf99xEPI2/view?usp=drive_link",
  },
]

export function Certifications() {
  const theme = useThemeName()
  // Fold the folder in the theme's ink colour so it reads against the paper.
  const folderColor = theme === "dark" ? "#ffccfd" : "#00663a"

  const papers = CERTS.map((c) => (
    <a
      key={c.name}
      className="cert-paper"
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      title={c.name}
      aria-label={`${c.name} — open certificate in a new tab`}
      onClick={(e) => e.stopPropagation()}
    >
      <img src={c.logo} alt={c.name} />
    </a>
  ))

  return (
    <section className="block">
      <div className="cert-stage">
        <Folder color={folderColor} size={2.6} items={papers} className="cert-folder" />
        <p className="cert-hint">Open the folder, then click a badge to verify.</p>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section className="block">
      <div className="contact-grid">
        <div>
          <div className="eyebrow">
            <b>Get in touch</b>
          </div>
          <h2 className="sec">Let&apos;s talk about your product.</h2>
          <p>
            I&apos;m looking for early-career product roles. If you&apos;re hiring,
            or you just want the raw evidence behind any piece here, the fastest
            way to reach me is email.
          </p>
        </div>
        <div>
          <ul className="channels">
            <li>
              <a href="mailto:jayanthadityaaa@gmail.com">
                <span className="lab">Email</span>
                <span className="val">jayanthadityaaa@gmail.com</span>
                <span className="arw">→</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jayanth-kappagantula/"
                target="_blank"
                rel="noopener"
              >
                <span className="lab">LinkedIn</span>
                <span className="val">linkedin.com/in/jayanth-kappagantula</span>
                <span className="arw">↗</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/ThisisjayK" target="_blank" rel="noopener">
                <span className="lab">GitHub</span>
                <span className="val">ThisisjayK</span>
                <span className="arw">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Resume() {
  return (
    <section className="block">
      <div className="block-head">
        <div className="eyebrow">
          <b>One page</b>
        </div>
        <h2 className="sec">Résumé</h2>
        <p>
          The short version: my experience, the tools I reach for, and my
          education, all on a single page. Grab the PDF, or ask and I&apos;ll send
          a copy tailored to the role.
        </p>
      </div>
      <ul className="channels" style={{ maxWidth: "40ch" }}>
        {/* TODO: drop resume.pdf in docs/ and point this at it */}
        <li>
          <a href="#" download>
            <span className="lab">PDF</span>
            <span className="val">Download résumé</span>
            <span className="arw">↓</span>
          </a>
        </li>
        <li>
          <a href="mailto:jayanthadityaaa@gmail.com">
            <span className="lab">Email</span>
            <span className="val">Ask for a tailored copy</span>
            <span className="arw">→</span>
          </a>
        </li>
      </ul>
      <p className="placeholder-note" style={{ marginTop: "1.6rem" }}>
        Drop your resume.pdf into docs/ and point the download link at it.
      </p>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="foot">
      <p>
        The evidence file, the original captures and my raw session notes for each
        teardown are in the{" "}
        <a
          href="https://github.com/ThisisjayK/Portfolio"
          target="_blank"
          rel="noopener"
        >
          repository
        </a>
        ,
        including the parts that didn&apos;t make the write-up. No affiliation with
        any product named here.
      </p>
    </footer>
  )
}
