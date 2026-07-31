import { useEffect } from "react";
import { AnimatedPage } from "../components/AnimatedPage";
// @ts-expect-error - JS component (React Bits), no type declaration
import FlowingMenu from "../components/FlowingMenu";
import { EXPERIENCE_ITEMS } from "../data/experience";

/* The Experience tab, built on the same two pieces as Volunteer: a FlowingMenu
   list of roles, and a detail page per role reusing the teardown/case-study
   chrome. Two sections sharing a pattern rather than two bespoke layouts, which
   is also why a third role can be added by editing data/experience.ts alone. */
export function Experience({ onOpen }: { onOpen?: (id: string) => void } = {}) {
  return (
    <section className="block experience-block">
      <div className="vol-menu">
        <FlowingMenu
          items={EXPERIENCE_ITEMS.map((e) => ({
            link: `#experience/${e.id}`,
            text: e.short,
            marqueeText: e.org,
            onSelect: () => onOpen?.(e.id),
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

export function ExperienceDetail({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const item = EXPERIENCE_ITEMS.find((e) => e.id === id);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <AnimatedPage
      className="teardown-page exp-page"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.role} at ${item.org}`}
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
        <div className="eyebrow">
          {item.eyebrow.map((e) => (
            <b key={e}>{e}</b>
          ))}
        </div>
        <h1>{item.title}</h1>
        <p className="lede">{item.lede}</p>
        <p className="exp-meta-line">{item.meta}</p>

        {/* The trailing blanks are load-bearing. .td-meta draws its gridlines by
            showing a tinted container background through 1px gaps between cells
            that are themselves paper, so any cell the facts do not fill reads as
            a solid tinted block rather than as empty. The case study fills its
            last row with a decorative cell; these pages have no art to put
            there, so they pad instead. Rounding up to a multiple of four covers
            both layouts at once: the grid is 4-up above 640px and 2-up below,
            and a multiple of four is a multiple of two. */}
        <dl className="td-meta">
          {item.facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
          {Array.from(
            { length: (4 - (item.facts.length % 4)) % 4 },
            (_, i) => (
              <div key={`fill-${i}`} aria-hidden="true" />
            ),
          )}
        </dl>

        <h2>What I did</h2>
        <ul className="vol-detail-list">
          {item.did.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        {/* Figures the team produced, kept visibly separate from the work above
            them. The heading does the work: a reader should not be able to
            mistake these for something measured here. */}
        {item.reported && (
          <div className="td-callout warn">
            <div className="h">Reported by the team, not measured by me</div>
            <div className="exp-reported">
              {item.reported.map((r) => (
                <div className="exp-reported__row" key={r.of}>
                  <span className="exp-reported__fig">{r.figure}</span>
                  <span className="exp-reported__of">{r.of}</span>
                </div>
              ))}
            </div>
            <p>
              The project reported these. I did not run the measurement and I
              cannot produce the baseline they were taken against, so I am not
              going to write them up as something I proved. They are on the page
              because they are on my résumé, and quietly dropping them here
              while leaving them there would be the dishonest way round.
            </p>
          </div>
        )}

        <h2>Limits worth holding while reading this</h2>
        <ul className="vol-detail-list">
          {item.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>

        <button className="teardown-back" type="button" onClick={onClose}>
          ← Back to experience
        </button>
      </div>
    </AnimatedPage>
  );
}
