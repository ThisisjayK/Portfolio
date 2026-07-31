import { useEffect, useMemo } from "react";
// @ts-expect-error - JS component, no type declaration
import CircularGallery from "../components/CircularGallery";
// Cover art lives with its source documents rather than in src/assets, so a
// write-up and its artwork stay in one folder.
import stageZeroGreen from "../../case-studies/stage-zero-health/assets/logo-card-green.svg";
import stageZeroPink from "../../case-studies/stage-zero-health/assets/logo-card-pink.svg";
import { useThemeName } from "../hooks/useThemeName";
import { useIsMobile } from "../hooks/useIsMobile";

/* One card per case study. `id` is what Work hands back on click so App knows
   which page to open.

   There used to be two "more soon" placeholder cards here, each with a sleeping
   frog animating on it. They were dropped: a placeholder does not read as
   "more on the way", it reads as an empty shelf, and pointing at the gaps made
   the body of work look thinner than it is. One written study shown on its own
   is a stronger page than one study flanked by two apologies. Add the next card
   here when its write-up exists. */
export type CaseId = "stage-zero";

const CASE_CARDS: {
  id: CaseId | null;
  title: string;
  green: string;
  pink: string;
}[] = [
  {
    id: "stage-zero",
    title: "Stage Zero Health",
    green: stageZeroGreen,
    pink: stageZeroPink,
  },
];

// The props default to {} so the component still satisfies the prop-less
// signature the SECTIONS map in App.tsx is typed against.
export function Work({
  onOpenCase,
}: { onOpenCase?: (id: CaseId) => void } = {}) {
  const theme = useThemeName();
  const mobile = useIsMobile();

  // Preload both ink variants so flipping the theme swaps the cover from cache
  // rather than leaving the card blank while the new file decodes.
  useEffect(() => {
    [stageZeroGreen, stageZeroPink].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Memoised so the gallery only rebuilds its WebGL context when the theme
  // (and therefore the artwork) actually changes.
  //
  // Note the inversion against the rest of the site: covers are named for their
  // ink, and each theme takes the ink it is NOT printed in, so the card reads as
  // paper laid on the page rather than a hole cut in it. Dark mode (green page)
  // gets the pink card with green type, light mode gets the green card.
  const items = useMemo(
    () =>
      CASE_CARDS.map((c) => ({
        image: theme === "dark" ? c.green : c.pink,
        text: "",
        id: c.id,
      })),
    [theme],
  );

  /* A carousel of one is not a carousel. CircularGallery loops by concatenating
     its item list onto itself (see `mediasImages` in the component), so a single
     card renders as two identical covers side by side, which reads as a
     duplicated card rather than as a gallery. While there is one write-up the
     tab shows its cover as a plain button instead, which is also the more
     accessible of the two: a real focusable control rather than a hit test
     inside a WebGL canvas. Adding a second entry to CASE_CARDS restores the
     carousel by itself. */
  const solo = CASE_CARDS.length < 2 ? CASE_CARDS[0] : null;

  return (
    <section className="block">
      {solo ? (
        <div className="case-solo">
          <button
            className="case-solo__card"
            type="button"
            onClick={() => solo.id && onOpenCase?.(solo.id)}
            aria-label={`Open the ${solo.title} case study`}
          >
            <img
              src={theme === "dark" ? solo.green : solo.pink}
              alt=""
              width={800}
              height={1000}
            />
          </button>
        </div>
      ) : (
        <div className="case-gallery">
          <CircularGallery
            items={items}
            bend={mobile ? 0.8 : 1.5}
            borderRadius={0.05}
            scrollEase={0.05}
            scrollSpeed={6.5}
            font={mobile ? "bold 20px Geist" : "bold 28px Geist"}
            onItemClick={(_i: number, item: { id: CaseId | null }) => {
              if (item?.id) onOpenCase?.(item.id);
            }}
          />
        </div>
      )}
    </section>
  );
}
