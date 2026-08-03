import { useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, MotionConfig } from "motion/react"
// OptionWheel is authored in JS (React Bits); the TS editor may not resolve its
// types, but Vite/esbuild bundles it fine and we do not run tsc in the build.
// @ts-expect-error - JS component, no type declaration
import OptionWheel from "../components/OptionWheel"
// Imported (not a public/ path) so Vite rewrites the URL for the GitHub Pages
// subpath build; a bare "/assets/..." would 404 under /product-teardowns/.
import clickSoft from "../assets/click-soft.mp3"
import { About, Work, Teardowns, Skills, Volunteer, VolunteerDetail, VOLUNTEER_ITEMS, Experience, ExperienceDetail, EXPERIENCE_ITEMS, Contact, Footer } from "../sections"
import type { CaseId } from "../sections"
import KickTeardown from "./KickTeardown"
import StageZeroHealth from "./StageZeroHealth"
import { IconSun, IconMoon } from "../components/icons"
import Loader from "../components/Loader"
import FrogMascot, { type FrogPose } from "../components/FrogMascot"
import { AnimatedPage } from "../components/AnimatedPage"
import { MobileMenu } from "../components/MobileMenu"
import { ResumeModal } from "../components/ResumeModal"
import { SkillModal } from "../components/SkillModal"
import { SKILL_EVIDENCE, type SkillTarget } from "../data/skill-evidence"
import { useIsMobile } from "../hooks/useIsMobile"

/* The résumé is deliberately not in here. It was a tab whose whole content was
   a download link, which is a poor use of a section; it is now a button in the
   bar that opens the PDF in a dialog over whichever tab you are on. */
type TabId =
  | "about"
  | "work"
  | "teardowns"
  | "experience"
  | "skills"
  | "volunteer"
  | "contact"

/* Experience sits after the two flagship pieces and before Skills: the case
   study and the teardown are the strongest things here so they stay first, and
   Skills links into Experience, so a reader meets the roles before the chips
   that point at them. */
const WHEEL: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Case Studies" },
  { id: "teardowns", label: "Teardowns" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "volunteer", label: "Volunteer" },
  { id: "contact", label: "Contact" },
]
const LABELS = WHEEL.map((w) => w.label)

const SECTIONS: Record<TabId, () => ReactNode> = {
  about: About,
  work: Work,
  teardowns: Teardowns,
  experience: Experience,
  skills: Skills,
  volunteer: Volunteer,
  contact: Contact,
}

const isTab = (v: string): v is TabId =>
  WHEEL.some((w) => w.id === v)

// In-site pages (the Kick teardown, each case study, each volunteering role) and
// the résumé dialog layer over a base tab but carry their own URL so they can be
// deep-linked and shown in the address bar.
type Overlay =
  | { kind: "kick" }
  | { kind: "case"; id: CaseId }
  | { kind: "volunteer"; id: string }
  | { kind: "experience"; id: string }
  | { kind: "resume" }
  | null
type Route = { tab: TabId; overlay: Overlay }

function routeToHash(r: Route): string {
  if (!r.overlay) return r.tab
  switch (r.overlay.kind) {
    case "kick":
      return "teardowns/kick"
    case "case":
      return "work/stage-zero-health"
    case "volunteer":
      return `volunteer/${r.overlay.id}`
    case "experience":
      return `experience/${r.overlay.id}`
    case "resume":
      return "resume"
  }
}

function parseHash(): Route {
  const h = window.location.hash.replace(/^#/, "")
  if (h === "teardowns/kick") return { tab: "teardowns", overlay: { kind: "kick" } }
  if (h === "work/stage-zero-health") {
    return { tab: "work", overlay: { kind: "case", id: "stage-zero" } }
  }
  // #resume is the same URL the résumé tab answered to before it became a
  // dialog, so old links keep working - they now open the PDF over About
  // rather than landing on a tab of their own. Opening it from the bar keeps
  // whichever tab you were on; only a cold load has no tab to preserve.
  if (h === "resume") return { tab: "about", overlay: { kind: "resume" } }
  const vm = h.match(/^volunteer\/(.+)$/)
  if (vm && VOLUNTEER_ITEMS.some((v) => v.id === vm[1])) {
    return { tab: "volunteer", overlay: { kind: "volunteer", id: vm[1] } }
  }
  const em = h.match(/^experience\/(.+)$/)
  if (em && EXPERIENCE_ITEMS.some((e) => e.id === em[1])) {
    return { tab: "experience", overlay: { kind: "experience", id: em[1] } }
  }
  return { tab: isTab(h) ? h : "about", overlay: null }
}

function indexFromHash(): number {
  const i = WHEEL.findIndex((w) => w.id === parseHash().tab)
  return i >= 0 ? i : 0
}

/* Theme lives on <html data-theme>; an inline script in index.html sets it
   before first paint, so here we just read that and keep it in sync. */
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () =>
      (document.documentElement.getAttribute("data-theme") as
        | "dark"
        | "light") || "dark",
  )
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    const m = document.querySelector('meta[name="theme-color"]')
    if (m) m.setAttribute("content", theme === "light" ? "#ffccfd" : "#00663a")
    try {
      localStorage.setItem("teardowns-theme", theme)
    } catch {
      /* ignore */
    }
  }, [theme])
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"))
  return { theme, toggle }
}

/* Reader text size. Mirrors useTheme: the value lives on <html data-text>,
   which the CSS turns into a --tscale multiplier, and is remembered across
   visits. Large is the default a first-time visitor gets; "sm" is the size the
   site originally shipped at. The inline script in index.html stamps the
   attribute before first paint, so reading it here is enough. */
type TextSize = "sm" | "lg" | "xl"

const TEXT_SIZES: { id: TextSize; label: string }[] = [
  { id: "sm", label: "Small" },
  { id: "lg", label: "Large" },
  { id: "xl", label: "XL" },
]

function useTextSize() {
  const [size, setSize] = useState<TextSize>(() => {
    const stamped = document.documentElement.getAttribute("data-text")
    // "default" is the old id for what is now "sm"; anyone who picked it before
    // the rename keeps the size they chose rather than being bumped to Large.
    if (stamped === "default") return "sm"
    return stamped === "sm" || stamped === "lg" || stamped === "xl"
      ? stamped
      : "lg"
  })
  useEffect(() => {
    document.documentElement.setAttribute("data-text", size)
    try {
      localStorage.setItem("teardowns-text-size", size)
    } catch {
      /* ignore */
    }
  }, [size])
  return { size, setSize }
}

function TextSizeControl() {
  const { size, setSize } = useTextSize()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on Escape, or on a pointer down anywhere outside the button+panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        setOpen(false)
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey, true)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey, true)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  return (
    <div ref={wrapRef} style={{ display: "contents" }}>
      <button
        className="theme-btn aa-btn"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Text size"
        title="Text size"
      >
        Aa
      </button>

      {open && (
        <div className="aa-panel" role="radiogroup" aria-label="Text size">
          {TEXT_SIZES.map((t) => (
            <button
              key={t.id}
              className="aa-opt"
              type="button"
              data-size={t.id}
              role="radio"
              aria-checked={size === t.id}
              onClick={() => setSize(t.id)}
            >
              <span className="spec" aria-hidden="true">
                Aa
              </span>
              <span className="lab">{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* There used to be a useClickSound hook here: a document-level pointerdown
   listener that played the soft click on every press anywhere on the page. It
   is gone deliberately. The click sample now belongs to the option wheel alone,
   where it marks a selection changing; everywhere else a press is silent, so the
   sound means something specific rather than following the cursor around. */

// Drives the mascot: left idle long enough, the frog snaps at something before
// settling back to idle. There used to be a "flies" stage in between - idle,
// then watching flies drift by, then the catch - but that sheet is gone, so the
// two waits are folded into one and the rhythm is unchanged: a tongue flick
// every three minutes. No sleeping pose here - this one's in the header, so it
// should always read as awake, not napping.
const IDLE_TO_CATCHING_MS = 3 * 60_000

function useFrogPose(): { pose: FrogPose; onCatchDone: () => void } {
  const [pose, setPose] = useState<FrogPose>("idle")

  useEffect(() => {
    if (pose === "idle") {
      const t = window.setTimeout(() => setPose("catching"), IDLE_TO_CATCHING_MS)
      return () => window.clearTimeout(t)
    }
  }, [pose])

  const onCatchDone = () => setPose("idle")

  return { pose, onCatchDone }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const mobile = useIsMobile()
  const [initial] = useState(indexFromHash)
  // Boot intro: the rotating-word + counter loader covers the app until it
  // finishes (or is skipped for reduced-motion visitors), then reveals the site.
  // Mobile drops all chrome animation, including this one, so it starts
  // already-booted there instead of playing the intro and then hiding it.
  const [booted, setBooted] = useState(mobile)
  // The Kick teardown and each case study open as in-site scrollable pages
  // layered over the app; each carries its own URL (see parseHash/routeToHash).
  const [route, setRoute] = useState<Route>(parseHash)
  const active = route.tab
  const { pose, onCatchDone } = useFrogPose()
  const kickOpen = route.overlay?.kind === "kick"
  const caseOpen: CaseId | null =
    route.overlay?.kind === "case" ? route.overlay.id : null
  const volunteerOpen: string | null =
    route.overlay?.kind === "volunteer" ? route.overlay.id : null
  const experienceOpen: string | null =
    route.overlay?.kind === "experience" ? route.overlay.id : null
  const resumeOpen = route.overlay?.kind === "resume"
  /* Local state rather than a route, unlike every other overlay here. The skill
     panel is a stepping stone and not a destination: it holds two sentences and
     a way onward, and its links immediately push a real URL for the page they
     open. Giving twenty-one chips twenty-one addresses would add history
     entries a reader has to press Back through to leave the Skills tab. */
  const [skill, setSkill] = useState<string | null>(null)

  // One place that moves both the app state and the address bar. Tab switches
  // replace the history entry; opening an overlay pushes one, so the browser
  // Back button (and the page's own close button) returns to the base tab.
  // `scroll` is the odd one out: every overlay here replaces the page and so
  // wants to open at the top, but the résumé dialog lays over a page that stays
  // put behind it, and resetting the scroll would silently lose the reader's
  // place while they read the PDF.
  const go = (next: Route, push = false, scroll = true) => {
    setRoute(next)
    const hash = "#" + routeToHash(next)
    if (push) history.pushState(null, "", hash)
    else history.replaceState(null, "", hash)
    if (scroll) window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }

  const select = (id: TabId) => go({ tab: id, overlay: null })
  const openKick = () => go({ tab: "teardowns", overlay: { kind: "kick" } }, true)
  const openCase = (id: CaseId) =>
    go({ tab: "work", overlay: { kind: "case", id } }, true)
  const openVolunteer = (id: string) =>
    go({ tab: "volunteer", overlay: { kind: "volunteer", id } }, true)
  const openExperience = (id: string) =>
    go({ tab: "experience", overlay: { kind: "experience", id } }, true)
  const openResume = () =>
    go({ tab: route.tab, overlay: { kind: "resume" } }, true, false)
  // Close the panel before routing, so the reader is not left with a dialog
  // hanging over the page it just sent them to.
  const openSkillTarget = (t: SkillTarget) => {
    setSkill(null)
    if (t.kind === "case") openCase("stage-zero")
    else if (t.kind === "kick") openKick()
    else openExperience(t.id)
  }
  const closeOverlay = () =>
    go({ tab: route.tab, overlay: null }, false, !resumeOpen)

  // Keep state in sync with the browser Back/Forward buttons.
  useEffect(() => {
    const onPop = () => setRoute(parseHash())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  /* The `id !== active` guard is load-bearing. The wheel is a controlled
     component: setting a tab moves its `selected` prop, and when it settles
     there it reports the move back through onChange. Without the guard that
     echo runs select() for the tab we just set, which replaces the URL with the
     bare tab and drops any overlay from it. That only shows up when one action
     changes the tab AND opens an overlay together (the About link into the case
     study is the first thing on the site that does), where it pushed
     #work/stage-zero-health and the echo immediately replaced it with #work,
     leaving a page whose address no longer pointed at it. Echoing back the
     current tab is a no-op, so treat it as one. */
  const onWheelChange = (index: number) => {
    const id = WHEEL[index]?.id
    if (id && isTab(id) && id !== active) select(id)
  }
  const onMobileSelect = (id: string) => {
    if (isTab(id)) select(id)
  }

  const Section = SECTIONS[active]

  // Built once and either dropped straight in (mobile - instant mount/unmount,
  // no chrome animation) or handed to AnimatePresence (desktop - unchanged).
  // AnimatedPage itself already collapses to a plain div on mobile; the
  // AnimatePresence wrapper is skipped there too rather than relying on a
  // plain div (which never signals "safe to remove") to unmount correctly
  // inside it.
  const sectionContent = (
    <AnimatedPage
      key={active}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.22, 0.68, 0.24, 1] }}
    >
      {active === "teardowns" ? (
        <Teardowns onOpenKick={openKick} />
      ) : active === "work" ? (
        <Work onOpenCase={openCase} />
      ) : active === "volunteer" ? (
        <Volunteer onOpen={openVolunteer} />
      ) : active === "experience" ? (
        <Experience onOpen={openExperience} />
      ) : active === "skills" ? (
        <Skills onOpen={setSkill} />
      ) : active === "about" ? (
        // The one link out of About, so the strongest thing on the site is one
        // click from the landing tab rather than four.
        <About onOpenCase={() => openCase("stage-zero")} />
      ) : (
        <Section />
      )}
    </AnimatedPage>
  )
  const kickOverlay = kickOpen && <KickTeardown key="kick" onClose={closeOverlay} />
  const caseOverlay = caseOpen === "stage-zero" && (
    <StageZeroHealth key="stage-zero" onClose={closeOverlay} />
  )
  const volunteerOverlay = volunteerOpen && (
    <VolunteerDetail key={volunteerOpen} id={volunteerOpen} onClose={closeOverlay} />
  )
  const experienceOverlay = experienceOpen && (
    <ExperienceDetail
      key={experienceOpen}
      id={experienceOpen}
      onClose={closeOverlay}
    />
  )
  const resumeOverlay = resumeOpen && (
    <ResumeModal key="resume" onClose={closeOverlay} />
  )
  const skillEvidence = skill ? SKILL_EVIDENCE[skill] : undefined
  const skillOverlay = skillEvidence && (
    <SkillModal
      key={skill}
      evidence={skillEvidence}
      onClose={() => setSkill(null)}
      onOpenTarget={openSkillTarget}
    />
  )

  return (
    <MotionConfig reducedMotion="user">
      {/* Boot intro overlay. Renders above everything until the count reaches
          100; the app mounts underneath meanwhile, so the WebGL background is
          ready by the time the loader fades. Skipped outright on mobile (see
          the `booted` initializer above). */}
      {!booted && <Loader onDone={() => setBooted(true)} />}
      <div className="shell has-rail">
        <header className="bar">
          <button
            className="mark"
            type="button"
            onClick={() => select("about")}
            aria-label="Home"
          >
            {mobile ? (
              // Pixel-art mascot dropped on mobile along with every other
              // pixel-art decoration; falls back to the plain wordmark it
              // originally stood in for.
              <span className="mark-text" aria-hidden="true">
                JK
              </span>
            ) : (
              <FrogMascot pose={pose} className="mark-frog" onDone={onCatchDone} />
            )}
          </button>
          <div className="sp" />
          <TextSizeControl />
          <button
            className="theme-btn"
            type="button"
            onClick={toggle}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
          {/* The résumé's only entry point now that it is not a tab, so it sits
              in the bar on mobile too rather than being folded into the
              hamburger with the sections. */}
          <button
            className="resume-btn"
            type="button"
            onClick={openResume}
            aria-haspopup="dialog"
          >
            Résumé
          </button>
          {mobile && (
            <MobileMenu
              items={WHEEL}
              activeId={active}
              onSelect={onMobileSelect}
            />
          )}
        </header>

        <main className="stage">
          {mobile ? sectionContent : (
            <AnimatePresence mode="wait">{sectionContent}</AnimatePresence>
          )}
        </main>

        {mobile ? kickOverlay : <AnimatePresence>{kickOverlay}</AnimatePresence>}
        {mobile ? caseOverlay : <AnimatePresence>{caseOverlay}</AnimatePresence>}
        {mobile ? (
          volunteerOverlay
        ) : (
          <AnimatePresence>{volunteerOverlay}</AnimatePresence>
        )}
        {mobile ? (
          experienceOverlay
        ) : (
          <AnimatePresence>{experienceOverlay}</AnimatePresence>
        )}
        {mobile ? (
          resumeOverlay
        ) : (
          <AnimatePresence>{resumeOverlay}</AnimatePresence>
        )}
        {mobile ? skillOverlay : <AnimatePresence>{skillOverlay}</AnimatePresence>}

        <Footer />

        {!mobile && (
          <nav className="wheel-nav" aria-label="Sections">
            <OptionWheel
              items={LABELS}
              defaultSelected={initial}
              selected={WHEEL.findIndex((w) => w.id === active)}
              onChange={onWheelChange}
              textColor={theme === "dark" ? "#ffccfd" : "#00502e"}
              activeColor={theme === "dark" ? "#f3d0f1" : "#00663a"}
              side="right"
              soundUrl={clickSoft}
              soundVolume={0.9}
              fontSize={2.2}
              spacing={1.5}
              curve={1}
              tilt={7}
              blur={2}
              fade={0.28}
              minOpacity={0.08}
              smoothing={200}
              inset={48}
              loop={false}
              draggable
            />
          </nav>
        )}
      </div>
    </MotionConfig>
  )
}
