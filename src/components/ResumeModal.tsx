import { useEffect, useRef } from "react"
import { AnimatedPage } from "./AnimatedPage"
import { IconClose, IconDownload } from "./icons"
import { useIsMobile } from "../hooks/useIsMobile"

/* The résumé, read in place. Opened from the Résumé button in the bar (there is
   no longer a Résumé tab), this lays a dialog over the page with the PDF in it
   and the page itself blurred behind, so a visitor can skim the résumé without
   losing where they were. The download that used to be the whole section is now
   a button in the dialog's own bar. */

// jayanth-resume.pdf lives in public/ (copied into docs/ on build); BASE_URL
// keeps the path correct under the /Portfolio/ Pages subpath, same as the old
// Résumé section did.
const PDF = `${import.meta.env.BASE_URL}jayanth-resume.pdf`
const FILENAME = "jayanth-resume.pdf"

export function ResumeModal({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  // Phone-sized viewports get the fallback below rather than the embedded
  // viewer. Keyed off the same 900px breakpoint as the rest of the site, so a
  // narrow desktop window is treated as a phone here too - an acceptable trade
  // for one shared definition of "small screen".
  const mobile = useIsMobile()

  // Escape closes. Focus moves into the panel on open so the keyboard starts
  // inside the dialog instead of back at the top of the page, and returns to
  // whatever opened it (the header button) on close.
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
      className="resume-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26, ease: [0.22, 0.68, 0.24, 1] }}
    >
      {/* The blurred page behind the dialog doubles as the dismiss target. */}
      <div
        className="resume-modal__scrim"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="resume-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Résumé"
        tabIndex={-1}
      >
        <div className="resume-modal__bar">
          <span className="resume-modal__title">Résumé</span>
          <div className="resume-modal__actions">
            <a className="resume-modal__btn" href={PDF} download={FILENAME}>
              <IconDownload />
              <span>Download</span>
            </a>
            <button
              className="resume-modal__btn resume-modal__close"
              type="button"
              onClick={onClose}
              aria-label="Close (Escape)"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {mobile ? (
          /* Mobile browsers will not scroll a PDF embedded in an iframe -
             WebKit paints only the first page and Chrome on Android often
             paints nothing at all - so rather than ship a viewer that looks
             broken, phones get the two links that do work. */
          <div className="resume-modal__fallback">
            <p>
              Phone browsers cannot scroll an embedded PDF, so the résumé opens
              in its own tab here.
            </p>
            {/* Only the one link here: Download is already in the bar above,
                and two of them side by side just made the reader choose twice. */}
            <a
              className="resume-modal__btn"
              href={PDF}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Open the PDF ↗</span>
            </a>
          </div>
        ) : (
          /* The browser's own PDF viewer. The fragment is what makes the whole
             résumé land on screen at once:
               view=Fit    fit the entire page, not just its width - FitH fills
                           the panel edge to edge and pushes the lower half of
                           the sheet below the fold.
               navpanes=0  no thumbnail sidebar, which was taking a third of the
                           width and shrinking the fitted page for a strip of
                           previews of a one-page document.
               toolbar=0   no viewer toolbar; the dialog's own bar already
                           carries the download, and the row bought nothing but
                           a second bar under ours.
             Every viewer takes only the parameters it knows, so zoom=page-fit
             rides along for Firefox, which implements that spelling and not
             view=. Nothing here is guaranteed, though - Safari honours very
             little of it - which is the other reason the panel itself is cut to
             the page's ratio: a viewer that ignores the fragment and falls back
             to fit-width still lands on very nearly the whole sheet. */
          <iframe
            className="resume-modal__doc"
            src={`${PDF}#view=Fit&zoom=page-fit&navpanes=0&toolbar=0`}
            title="Résumé"
          />
        )}
      </div>
    </AnimatedPage>
  )
}
