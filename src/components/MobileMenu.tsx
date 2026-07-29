import { useEffect, useRef, useState } from "react"
import { IconMenu, IconClose } from "./icons"
import "./MobileMenu.css"

/* Replaces the desktop OptionWheel on mobile: a plain hamburger + dropdown list,
   the "regular menu" a touch visitor expects. No slide/fade on open or close -
   the panel just mounts/unmounts, matching the site-wide no-animation rule for
   mobile. */
export type MobileMenuItem = { id: string; label: string }

export function MobileMenu({
  items,
  activeId,
  onSelect,
}: {
  items: MobileMenuItem[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
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
    <div ref={wrapRef} className="mobile-menu">
      <button
        className="mobile-menu__toggle"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <IconClose /> : <IconMenu />}
      </button>

      {open && (
        <nav
          id="mobile-menu-panel"
          className="mobile-menu__panel"
          aria-label="Sections"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                "mobile-menu__item" +
                (item.id === activeId ? " mobile-menu__item--active" : "")
              }
              aria-current={item.id === activeId ? "page" : undefined}
              onClick={() => {
                onSelect(item.id)
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
