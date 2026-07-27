import { useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
// OptionWheel is authored in JS (React Bits); the TS editor may not resolve its
// types, but Vite/esbuild bundles it fine and we do not run tsc in the build.
// @ts-expect-error - JS component, no type declaration
import OptionWheel from "./OptionWheel"
// Imported (not a public/ path) so Vite rewrites the URL for the GitHub Pages
// subpath build; a bare "/assets/..." would 404 under /product-teardowns/.
import clickSoft from "./assets/click-soft.mp3"
// @ts-expect-error - JS component (React Bits), no type declaration
import PixelTrail from "./PixelTrail"
import { About, Work, Teardowns, Skills, Resume, Contact, Footer } from "./sections"
import type { CaseId } from "./sections"
import KickTeardown from "./KickTeardown"
import StageZeroHealth from "./StageZeroHealth"
import { IconSun, IconMoon } from "./icons"

type TabId =
  | "about"
  | "work"
  | "teardowns"
  | "skills"
  | "resume"
  | "contact"

const WHEEL: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Case Studies" },
  { id: "teardowns", label: "Teardowns" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
]
const LABELS = WHEEL.map((w) => w.label)

const SECTIONS: Record<TabId, () => ReactNode> = {
  about: About,
  work: Work,
  teardowns: Teardowns,
  skills: Skills,
  resume: Resume,
  contact: Contact,
}

const isTab = (v: string): v is TabId =>
  WHEEL.some((w) => w.id === v)

// In-site pages (the Kick teardown, each case study) layer over a base tab but
// get their own URL so they can be deep-linked and shown in the address bar.
type Overlay = "kick" | "stage-zero" | null
type Route = { tab: TabId; overlay: Overlay }

const OVERLAY_ROUTES: Record<
  Exclude<Overlay, null>,
  { tab: TabId; hash: string }
> = {
  kick: { tab: "teardowns", hash: "teardowns/kick" },
  "stage-zero": { tab: "work", hash: "work/stage-zero-health" },
}

function routeToHash(r: Route): string {
  return r.overlay ? OVERLAY_ROUTES[r.overlay].hash : r.tab
}

function parseHash(): Route {
  const h = window.location.hash.replace(/^#/, "")
  for (const key of Object.keys(OVERLAY_ROUTES) as Exclude<Overlay, null>[]) {
    if (OVERLAY_ROUTES[key].hash === h) {
      return { tab: OVERLAY_ROUTES[key].tab, overlay: key }
    }
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

/* A soft click on every press, using the same sample the option wheel plays.
   Fires on pointerdown rather than click so the sound lands with the press
   instead of trailing it. Presses inside the wheel rail are skipped: the wheel
   plays this sample itself when the selection changes, and without the skip a
   press there would stack two copies. */
function useClickSound(src: string, volume = 0.65) {
  useEffect(() => {
    // A small pool, so a quick second press overlaps the first instead of
    // rewinding it and cutting the first one off.
    const pool = Array.from({ length: 4 }, () => {
      const a = new Audio(src)
      a.volume = volume
      a.preload = "auto"
      return a
    })
    let next = 0
    const onDown = (e: PointerEvent) => {
      const el = e.target as Element | null
      if (el?.closest?.(".wheel-nav")) return
      // The wordmark (home) is intentionally silent.
      if (el?.closest?.(".mark")) return
      const a = pool[next++ % pool.length]
      try {
        a.currentTime = 0
        // Browsers reject playback until the page has had a real gesture; a
        // press is one, so this only ever rejects in edge cases worth ignoring.
        void a.play()?.catch(() => {})
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      pool.forEach((a) => a.pause())
    }
  }, [src, volume])
}

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width:900px)").matches,
  )
  useEffect(() => {
    const mq = window.matchMedia("(max-width:900px)")
    const on = () => setMobile(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return mobile
}

export default function App() {
  const { theme, toggle } = useTheme()
  const mobile = useIsMobile()
  useClickSound(clickSoft)
  const [initial] = useState(indexFromHash)
  // The Kick teardown and each case study open as in-site scrollable pages
  // layered over the app; each carries its own URL (see parseHash/routeToHash).
  const [route, setRoute] = useState<Route>(parseHash)
  const active = route.tab
  const kickOpen = route.overlay === "kick"
  const caseOpen: "stage-zero" | null =
    route.overlay === "stage-zero" ? "stage-zero" : null

  // One place that moves both the app state and the address bar. Tab switches
  // replace the history entry; opening an overlay pushes one, so the browser
  // Back button (and the page's own close button) returns to the base tab.
  const go = (next: Route, push = false) => {
    setRoute(next)
    const hash = "#" + routeToHash(next)
    if (push) history.pushState(null, "", hash)
    else history.replaceState(null, "", hash)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }) // open at the top
  }

  const select = (id: TabId) => go({ tab: id, overlay: null })
  const openKick = () => go({ tab: "teardowns", overlay: "kick" }, true)
  const openCase = (id: CaseId) => go({ tab: "work", overlay: id }, true)
  const closeOverlay = () => go({ tab: route.tab, overlay: null })

  // Keep state in sync with the browser Back/Forward buttons.
  useEffect(() => {
    const onPop = () => setRoute(parseHash())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const onWheelChange = (index: number) => {
    const id = WHEEL[index]?.id
    if (id && isTab(id)) select(id)
  }

  const Section = SECTIONS[active]

  return (
    <MotionConfig reducedMotion="user">
      {/* Site-wide interactive background: a pixel trail in the theme's brand
          ink (pink in dark, green in light), fixed behind all content. */}
      <PixelTrail
        gridSize={60}
        trailSize={0.06}
        maxAge={300}
        interpolate={5}
        color={theme === "dark" ? "#ffccfd" : "#00663a"}
        gooeyFilter={{ id: "brand-goo-filter", strength: 4 }}
      />
      <div className="shell has-rail">
        <header className="bar">
          <button
            className="mark"
            type="button"
            onClick={() => select("about")}
            aria-label="Home"
          >
            JK
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
        </header>

        <main className="stage">
          <AnimatePresence mode="wait">
            <motion.div
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
              ) : (
                <Section />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {kickOpen && <KickTeardown key="kick" onClose={closeOverlay} />}
        </AnimatePresence>

        <AnimatePresence>
          {caseOpen === "stage-zero" && (
            <StageZeroHealth key="stage-zero" onClose={closeOverlay} />
          )}
        </AnimatePresence>

        {active === "contact" && <Footer />}

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
            fontSize={mobile ? 1.25 : 2.2}
            spacing={1.5}
            curve={1}
            tilt={7}
            blur={2}
            fade={0.28}
            minOpacity={0.08}
            smoothing={200}
            inset={mobile ? 16 : 48}
            loop={false}
            draggable
          />
        </nav>
      </div>
    </MotionConfig>
  )
}
