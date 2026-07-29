import { useEffect, useState } from "react";

// Reads the current theme off <html data-theme> and re-renders when it flips.
export function useThemeName(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark",
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() =>
      setTheme(el.getAttribute("data-theme") === "light" ? "light" : "dark"),
    );
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

/* Section content. Copy is ported verbatim from the static site; the bracketed
   text and the {/* TODO *​/} notes mark what Jay still needs to fill in. No em
   dashes anywhere, per house style. */
