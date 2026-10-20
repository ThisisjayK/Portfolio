# Lid lift for Framer

Click the portrait and the top of the head pops off, the doodles fly out, click again to close.

| File | What it is |
|---|---|
| `HeadLidLift.tsx` | The Framer code component. This is the only file that goes into Framer. |
| `portrait-cutout.png` | The portrait with the grey background removed (1254 × 1254, transparent). Upload this as the Portrait. |
| `harness/` | Local test bed (stubs Framer's `framer` package). Not for Framer. Run it with the `framer-lid-harness` entry in `.claude/launch.json`. `harness/samples/` holds throwaway test art, not real assets. |

## Putting it into Framer

Menu names are from memory, so they may differ slightly in your version of Framer.

1. In the Assets panel, open **Code** and create a new code file. Name it `HeadLidLift`.
2. Replace everything in it with the contents of `HeadLidLift.tsx` and save.
3. Drag `HeadLidLift` from Assets onto your page. Any frame size works; the drawing scales to fit.
   It was designed at 600 × 680.
4. In the right-hand properties panel, set **Portrait** to `portrait-cutout.png` and give it alt text.
5. Open Preview and click the face. (Code components may not animate on the editing canvas itself.)

## Properties

| Property | Default | Use it when |
|---|---|---|
| Portrait | none | Always set this. |
| Open portrait | none | The face shown while the lid is up (e.g. starry eyes). It crossfades in on open and back out on close. Leave empty to keep one face. |
| Doodles | none | Your own doodle images, up to 10, in the order you want them. Leave empty to use the built-in placeholder doodles. |
| Hint | Pop the lid | You want different bubble text, or none (leave it empty). |
| Cut line % | 30 | Where the head splits, as a % from the top of the image. Only change it if you swap the portrait. |
| Rim center % / Rim width % | 53.3 / 58.4 | Position and width of the opening. Same: only for a new portrait. |
| Ink | #111111 | Your final ink colour, once you've chosen your palette. |

## Preparing your artwork

**Open portrait.** The component shows the bottom part of this image (below the cut line) in
place of the normal face, so it has to line up exactly with `portrait-cutout.png`:

- Same canvas size (1254 × 1254) and the head in the same spot. The easiest way is to draw it
  on top of `portrait-cutout.png` in the same file and export only the changed version.
- Transparent background.
- Only the face changes. The hair above the cut line comes from the normal portrait, since that part is the lid.

**Doodles.**

- PNG or SVG, transparent background, roughly square. Each one is fitted inside a 96 × 96 box
  (80 × 80 with nine or ten doodles), so a lot of empty space around a drawing makes it look small.
- Up to 4 doodles sit in one row; 5 to 10 go in two rows.
- The Ink property doesn't recolour uploaded images. Export them in your final colours.

## Not done yet

- The hint bubble uses a system font. Swap in your typeface once you share it.
- The built-in placeholder doodles are drawn in code; uploading your own replaces all of them.
- Tested in a Chromium browser with a stub for Framer. **Not tested inside Framer itself or in Safari.**
