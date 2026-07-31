import { useEffect, useRef } from "react"
import { AnimatedPage } from "./AnimatedPage"
import { IconClose } from "./icons"
import type { SkillEvidence, SkillTarget } from "../data/skill-evidence"

/* The panel behind a clickable skill chip: why the skill is on the list, and
   the way into the page that proves it. Built on the same scrim-and-panel
   pattern as ResumeModal so the two read as one piece of chrome, and for the
   same reason: the page stays visible and blurred behind it rather than being
   replaced, because the reader is mid-list and should not lose it.

   The links are the point. This panel is a route into the long-form pages, not
   a place to restate them, which is what keeps twenty-one of these from turning
   into twenty-one dead ends that all say "Stage Zero Health". */

const TARGET_LABEL: Record<SkillTarget["kind"], string> = {
  case: "Stage Zero Health case study",
  kick: "Kick teardown",
  experience: "Bluevoir, business analyst",
}

export function SkillModal({
  evidence,
  onClose,
  onOpenTarget,
}: {
  evidence: SkillEvidence
  onClose: () => void
  onOpenTarget: (t: SkillTarget) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Same contract as ResumeModal: Escape closes, focus moves into the panel on
  // open and returns to the chip that opened it on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    panelRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey)
      opener?.focus?.()
    }
  }, [onClose])

  return (
    <AnimatedPage
      className="skill-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 0.68, 0.24, 1] }}
    >
      <div className="skill-modal__scrim" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className="skill-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={evidence.name}
        tabIndex={-1}
      >
        <div className="skill-modal__bar">
          <span className="skill-modal__title">{evidence.name}</span>
          <button
            className="skill-modal__btn skill-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Close (Escape)"
          >
            <IconClose />
          </button>
        </div>

        <div className="skill-modal__body">
          <p className="skill-modal__why">{evidence.why}</p>

          {evidence.where.length > 0 && (
            <>
              <span className="skill-modal__lab">Where</span>
              <ul className="skill-modal__where">
                {evidence.where.map((t) => (
                  <li key={t.kind + ("id" in t ? t.id : "")}>
                    <button
                      className="skill-modal__link"
                      type="button"
                      onClick={() => onOpenTarget(t)}
                    >
                      {TARGET_LABEL[t.kind]} →
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  )
}
