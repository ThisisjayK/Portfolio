import { useEffect, useMemo } from "react";
// @ts-expect-error - JS component, no type declaration
import CircularGallery from "../components/CircularGallery";
// Cover art lives with its source documents rather than in src/assets, so a
// write-up and its artwork stay in one folder.
import stageZeroGreen from "../../case-studies/stage-zero-health/assets/logo-card-green.svg";
import stageZeroPink from "../../case-studies/stage-zero-health/assets/logo-card-pink.svg";
// Shared placeholders for slots with no write-up yet. They live in src/assets
// rather than a case-study folder because they belong to no project.
import soonCardGreen from "../assets/soon-card-green.svg";
import soonCardPink from "../assets/soon-card-pink.svg";
import frogSleepingSheet from "../assets/frog/sleeping/sleeping_sheet_transparent.png";
import { useThemeName } from "../hooks/useThemeName";
import { useIsMobile } from "../hooks/useIsMobile";

// One card per case study. `id` is what Work hands back on click so App knows
// which page to open; the remaining cards are still placeholders and open
// nothing until their write-ups exist.
export type CaseId = "stage-zero";

const CASE_CARDS: { id: CaseId | null; green: string; pink: string }[] = [
  { id: "stage-zero", green: stageZeroGreen, pink: stageZeroPink },
];

// Empty slots, drawn in the same two inks rather than borrowed stock photos, so
// the carousel reads as "one study written, more on the way" instead of showing
// artwork for pieces that do not exist. They carry no id and so open nothing.
const PLACEHOLDER_COUNT = 2;

// Must match the sleeping entry in FrogMascot's POSES table and the strip length
// of sleeping_sheet_transparent.png (252x32 = 9 frames of 28x32).
const SLEEPING_FRAMES = 9;
const SLEEPING_FPS = 5;

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
    [stageZeroGreen, stageZeroPink, soonCardGreen, soonCardPink].forEach(
      (src) => {
        const img = new Image();
        img.src = src;
      },
    );
  }, []);

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
        // The napping frog is cycled by the gallery rather than baked into the
        // card art. `rect` is the frog's box in the card's texture space, in the
        // same units the shader samples: the SVG reserves x=300 y=286 w=200
        // h=229 of its 800x1000 canvas, and y is measured from the bottom here
        // because texture space is flipped against SVG's top-down y.
        //   x 300/800, w 200/800, h 229/1000, y 1 - (286+229)/1000
        // Mobile drops every pixel-art decoration, so the sprite is left off
        // the placeholder cards entirely there.
        ...(mobile
          ? {}
          : {
              sprite: {
                src: frogSleepingSheet,
                frames: SLEEPING_FRAMES,
                fps: SLEEPING_FPS,
                rect: [0.375, 0.485, 0.25, 0.229] as const,
              },
            }),
      })),
    ],
    [theme, mobile],
  );

  return (
    <section className="block">
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
    </section>
  );
}
