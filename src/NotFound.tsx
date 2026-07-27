import { useState } from "react"
// @ts-expect-error - JS component (React Bits), no type declaration
import FuzzyText from "./FuzzyText"
import { IconSun, IconMoon } from "./icons"

// Standalone 404 page (its own build entry -> docs/404.html, which GitHub Pages
// serves for unknown paths). Themed like the rest of the site: paper background
// with the fuzzy text drawn in the opposite ink, and a toggle so both the dark
// and light versions are reachable.
export default function NotFound() {
  const [theme, setTheme] = useState<"dark" | "light">(
    () =>
      (document.documentElement.getAttribute("data-theme") as
        | "dark"
        | "light") || "dark",
  )

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", next)
    const m = document.querySelector('meta[name="theme-color"]')
    if (m) m.setAttribute("content", next === "light" ? "#ffccfd" : "#00663a")
    try {
      localStorage.setItem("teardowns-theme", next)
    } catch {
      /* ignore */
    }
    setTheme(next)
  }

  // Ink is the opposite of the paper: pink on the green (dark) page, green on
  // the pink (light) page.
  const ink = theme === "dark" ? "#ffccfd" : "#00663a"
  const home = import.meta.env.BASE_URL

  return (
    <main className="notfound">
      <button
        className="theme-btn notfound-toggle"
        type="button"
        onClick={toggle}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "dark" ? <IconSun /> : <IconMoon />}
      </button>

      <div className="notfound-stack">
        <FuzzyText
          fontFamily="'Kick Font'"
          fontWeight={400}
          fontSize="clamp(3.5rem, 18vw, 12rem)"
          color={ink}
          baseIntensity={0.2}
          hoverIntensity={0.6}
          enableHover
        >
          404
        </FuzzyText>
        <FuzzyText
          fontFamily="'Kick Font'"
          fontWeight={400}
          fontSize="clamp(1rem, 4.5vw, 2.6rem)"
          color={ink}
          baseIntensity={0.18}
          hoverIntensity={0.5}
          enableHover
        >
          ERROR: NOT FOUND
        </FuzzyText>

        <a className="notfound-home" href={home}>
          ← Back to home
        </a>
      </div>
    </main>
  )
}
