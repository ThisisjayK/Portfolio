import { useEffect, useMemo } from "react";
// @ts-expect-error - JS component, no type declaration
import InfiniteMenu from "../components/InfiniteMenu";
// Two logo tiles (transparent background) in each theme's ink colour, so the
// wordmark stays legible over the page's pink (light) / green (dark) paper.
import kickGreen from "../assets/kick-green.svg";
import kickPink from "../assets/kick-pink.svg";
import soonTileGreen from "../assets/soon-tile-green.svg";
import soonTilePink from "../assets/soon-tile-pink.svg";
import { useThemeName } from "../hooks/useThemeName";
import { useIsMobile } from "../hooks/useIsMobile";

// Props default to {} for the same reason as Work above: the SECTIONS map in
// App.tsx is typed against a prop-less signature.
export function Teardowns({ onOpenKick }: { onOpenKick?: () => void } = {}) {
  const theme = useThemeName();
  const mobile = useIsMobile();

  // Preload both theme variants once so a theme flip swaps the logo from cache
  // instead of triggering a fresh network/decode, which is what left the sphere
  // briefly blank while the new logo loaded.
  useEffect(() => {
    [kickGreen, kickPink, soonTileGreen, soonTilePink].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // One entry per product torn down, plus a placeholder face so the sphere has
  // something to rotate between while there is only one teardown written. No
  // title/description by design (logos only). `id` is what the click handler
  // reads: only the kick face opens anything. Memoised so InfiniteMenu re-inits
  // only when the theme (and thus the artwork) actually changes.
  const items = useMemo(
    () => [
      {
        id: "kick",
        image: theme === "dark" ? kickPink : kickGreen,
        link: "kick/",
        title: "",
        description: "",
      },
      {
        id: "soon",
        image: theme === "dark" ? soonTilePink : soonTileGreen,
        link: "",
        title: "",
        description: "",
      },
    ],
    [theme],
  );

  return (
    <section className="block">
      <div className="teardown-sphere">
        <InfiniteMenu
          items={items}
          scale={mobile ? 0.72 : 1}
          onItemClick={(item: { id?: string }) => {
            if (item?.id === "kick") onOpenKick?.();
          }}
        />
      </div>
    </section>
  );
}

/* Three groups so the existing .par grid (three equal columns) holds them
   without new layout CSS; the chips reuse .meta span from the teardown list.
   Everything listed here is drawn from work Jay has actually described rather
   than a generic PM skills inventory, so it stays defensible in an interview. */
