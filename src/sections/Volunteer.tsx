import { useEffect } from "react";
import { AnimatedPage } from "../components/AnimatedPage";
// @ts-expect-error - JS component (React Bits), no type declaration
import FlowingMenu from "../components/FlowingMenu";
import { VOLUNTEER_ITEMS } from "../data/volunteer";

export function Volunteer({ onOpen }: { onOpen?: (id: string) => void } = {}) {
  return (
    <section className="block volunteer-block">
      <div className="vol-menu">
        <FlowingMenu
          items={VOLUNTEER_ITEMS.map((v) => ({
            link: `#volunteer/${v.id}`,
            text: v.short,
            marqueeText: v.role,
            image: v.image
              ? `${import.meta.env.BASE_URL}${v.image}`
              : undefined,
            onSelect: () => onOpen?.(v.id),
          }))}
          speed={18}
          bgColor="transparent"
          textColor="var(--ink)"
          marqueeBgColor="var(--ink)"
          marqueeTextColor="var(--paper)"
          borderColor="var(--ink-28)"
        />
      </div>
    </section>
  );
}

// A volunteering role opens as an in-site page (reusing the teardown/case-study
// chrome) explaining what Jay did, with a link out to the organisation.
export function VolunteerDetail({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const item = VOLUNTEER_ITEMS.find((v) => v.id === id);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  // Shared by both layouts: with a photo it sits in the right-hand column, without
  // one it stays the single centred column the other roles use.
  const copy = (
    <>
      <h1>{item.org}</h1>
      <p className="lede">{item.meta}</p>
      <ul className="vol-detail-list">
        {item.did.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <a
        className="inline"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit {item.short} ↗
      </a>
    </>
  );

  return (
    <AnimatedPage
      className={`teardown-page vol-page${item.photo ? " vol-page--media" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.short} volunteering`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.22, 0.68, 0.24, 1] }}
    >
      <button
        className="teardown-close"
        type="button"
        onClick={onClose}
        aria-label="Close (Escape)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Esc</span>
      </button>

      <div className="teardown-page__inner">
        {item.photo ? (
          <div className="vol-split">
            <figure className="vol-split__media">
              {/* eager, not lazy: this is the artwork the route exists to show,
                  and it sizes its own grid column. Lazy could never bootstrap —
                  a zero-width box does not intersect the viewport, so the fetch
                  that would give it a width never fires. */}
              <img
                src={`${import.meta.env.BASE_URL}${item.photo}`}
                alt={item.photoAlt ?? ""}
                width={item.photoW}
                height={item.photoH}
                loading="eager"
                decoding="async"
              />
            </figure>
            <div className="vol-split__body">{copy}</div>
          </div>
        ) : (
          copy
        )}
      </div>
    </AnimatedPage>
  );
}
