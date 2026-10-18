# Design system

The visual rules for the site. Code uses these tokens and never hard-codes values.

Status: draft. Fill in after product.md, because the audience and positioning decide the look.

## 1. Principles
Three to five principles, each with a "this, not that" example.
1. TBD
2. TBD
3. TBD

## 2. References
### Main reference: https://huyml.co/ (Huy Phan, award-winning web designer)
Chosen by Jayanth, 2026-10-16. **What Jayanth wants to borrow:**
1. **The playfulness overall.**
2. **The about page format:**
   - A play on the birth year. Huy splits "19" and "96"; Jayanth's version uses **20** / **02**.
   - **Top right, in red:** a short list of personal favorites and important things (Huy's are things like "PLANT DADDY" and "3 CATS CALL HIM DAD").
   - **Bottom right, in red:** what Jayanth does.
   - The other link lists on Huy's about page (awards, publications, clients) are skipped.
3. **A face illustration whose cap pops off.** The things inside the head are clickable and open as collectible-style notes, like the notes in *The Last of Us* or *Ghost of Tsushima*.
   - Already prototyped: `prototypes/framer-lid/HeadLidLift.tsx` (Framer component, lid lifts and doodles fly out) and `prototypes/head-click/`.
4. **A playground tab**, which becomes Jayanth's own mood board or vision board.
5. **A cute contact card.**
6. **The home page stays blank for now** (Jayanth's words; see the open conflict below).

**What will differ:** the font and colors. Jayanth's own illustration, text and doodles.

### Rules for using a reference (proposed 2026-10-16)
- Borrow **ideas and structure** (the year split, the red side lists, the head that opens). Don't copy Huy's code, illustrations, copy or exact layout. Everything that ships is drawn, written and built for Jayanth.
- Add a small footer credit, e.g. "Inspired by Huy Phan's huyml.co." It's honest, and it shows taste instead of risk.

### Hero (rebuilt 2026-10-17, current version): blue bloom
- **The silhouette video is replaced by a code-drawn bloom of blues** (`src/components/BlueBloom.tsx`, one WebGL fragment shader). Jayanth chose direction "B · Cool bloom" from a scrubbable preview, then asked for shades of the current blue only, each layer with its own look.
- **Five layers, all on the accent's hue (~214°), lightest first, each drawn differently:**
  1. Mist `--bloom-mist` `#E6F1FF`: a feathered wash, the widest layer. Letters stay visible on it.
  2. Powder `--bloom-powder` `#BFDBFF`: seven nested contour ripples, each turned slightly against the last.
  3. Sky `--accent-fill` `#8BBDFF`: one solid amoeba (the letters' blob shape).
  4. Cornflower `--bloom-cornflower` `#5A9BF0`: a fixed 9px halftone dot screen, dots shrinking toward the edge.
  5. Cobalt `--accent` `#2072DF`: cut paper printed off register over a `--bloom-navy` `#123F7D` shadow (5px, 4px). A 12px cobalt drop sits in the middle column before any scroll, as the focal point.
- **Grain:** fixed monochrome noise per CSS pixel (about ±4.5%), baked into the shader. It never moves on its own (no looping, per §6). It stops at the flood, because the flood is a flat panel so the next section matches exactly.
- **Scroll timings unchanged:** layers grow from 0–50% (mist) to 36–80% (cobalt) of the hero's scroll, flat `--accent-fill` flood 80–90%, line 85–97%, "on blue" from 86%.
- **Letters and roll box unchanged.** The letters now hide when the powder layer or a darker one reaches them (the roll box stays visible throughout, see §7), worked out from the bloom's geometry (`bloomCovers`) instead of reading video pixels. Without WebGL the canvas stays plain white and nothing hides until the flood.
- Reduced motion: the still first frame (white grain and the cobalt drop), no scrubbing.
- The old clip (`src/assets/hero/hero.mp4`, `hero-poster.webp`) and `src/content/heroTimeline.ts` are no longer used. Kept in the repo until Jayanth says to delete them.

### Hero, video version (2026-10-16, superseded 2026-10-17)
- **Now uses the third Kling clip** (`design/hero/kling-v3.mp4`): a real camera push all the way into the lens (goggle-to-head width ratio steady at 0.88–0.92, rising only slightly at the very end as the goggles get closer to the camera, which is correct perspective). Leveled to within ±0.5°. Scroll map is half even in time, half even in measured zoom; flat pink fades in at 80–90% of the hero's scroll. The code-zoom version below is superseded.
- **No visible name or role on the hero** (Jayanth, 2026-10-16). The silhouette stands alone; "Jayanth Kappagantula, product manager in healthcare" stays as a visually hidden `h1` for screen readers and search.
- **Interest notes: removed from the hero for now** (Jayanth, 2026-10-16, didn't like the placement). `CrumpleNotes` and `src/assets/interests/` stay in the repo, unused, for a new placement later. As built (`CrumpleNotes`, 2026-10-16): while the head turns (hero scroll ~3–33%), six paper notes pop in as crumpled balls and unfold around the silhouette (doodle + label + Jayanth's note, from about-me.md §1b); they crumple away as the camera pushes in (~43–56%). Paper is `--paper` with a soft shadow. Phones show the label only, below the goggles. Reduced motion / no WebGL: flat HTML cards. Copy is a placeholder until Jayanth sends write-ups.

### Hero, earlier versions
- Clip: Kling 2.5 Turbo (`design/hero/kling25.mp4`, start frame `design/hero/start-frame-16x9.png`), leveled frame by frame (tilt from up to 1.9° down to about ±0.3°), encoded 1920px wide with a keyframe every 4 frames so seeking on scroll is smooth (`src/assets/hero/hero.mp4`, ~1.9 MB).
- **Revised the same day:** after about 7s the clip inflated the goggles instead of moving the camera (the head stayed the same size). The hero now uses the clip only up to **6.75s** (measured: lens-to-shoulder ratio holds at about 0.32 from 3s to 6.9s, so it's a real camera move), then zooms the **whole frame** toward the lens in code (up to 12×), so head, goggles and shoulders grow together.
- Scroll map (`src/content/heroTimeline.ts`): video phase is half even in time, half even in measured zoom; code zoom is exponential, starting at roughly the speed the video ends at.
- A glow sized to the lens grows in late in the zoom, inside the zoomed layer, so the head stays black.
- From 80–90% of the hero's scroll, a flat `--pink` panel fades in over the lens glow, so the hand-off lands on exactly #FF4FA3 and the next section continues on that pink.
- Hero text is white with `mix-blend-mode: difference`, so it reads over both the white backdrop and the black silhouette.
- Reduced motion: no scrubbing; a still poster plus the same text.

### Page decisions (Jayanth, 2026-10-16)
1. **Home page stays blank for now.** Work on the other tabs first. ⚠ Risk to revisit before launch: LinkedIn and résumé links land on `/`. Either the home page gets content by 2026-10-20, or the shared link points to the about page.
2. **Facts without clicking: agreed.** Name, intro, what Jayanth does and contact are always visible. The head and its notes are a bonus layer.
3. **Playground: built after launch, but the tab exists in v1** (e.g. a simple "in progress" page).


### Direction change (Jayanth, 2026-10-16, after seeing https://www.1367studio.com/)
Replaces earlier decisions where they conflict:
1. **The whole site is scroll-driven.** Sections hand off to each other with scroll-linked transitions, like 1367 Studio's hero. (Verified by inspecting their page: an 8.75s `hero-video.mp4` stays paused and its time is tied to scroll. The figure turns, the camera pushes into the goggles, and the lens glow floods the screen into the next section.)
2. **Hero: a silhouette of Jayanth wearing pink glasses, made from a real photo plus an AI-generated turning video.** This reverses the earlier "no photo" decision, for the silhouette only.
3. **Pages may scroll** on every screen size. The no-scroll rule is retired.
4. **Pink replaces red as the accent.** See Color.
- Borrow the mechanism (a scrubbed video, a push into the lenses, a colour flood), not 1367's footage, layout or copy.
- Open: whether the head-lid and doodles stay (e.g. in About), and the 25-line copy review from the prototype.

## 3. Color
Decided by Jayanth, 2026-10-16: **light theme only. Monochrome (mostly white and black) with a small pop of color.** No dark mode in v1.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--fg` | `#111111` (18.9:1 on white) | Body text, illustration ink |
| `--muted` | `#6B6B6B` (5.3:1 on white) | Secondary text |
| `--accent`, `--accent-fill` | **Blue** (Jayanth, 2026-10-17; replaced pink `#DB2777`/`#FF4FA3`, which replaced red). `--accent-fill` `#8BBDFF` for fills and large areas (blobs, the hero flood and the section after it, the nav ball, cards): only **1.94:1 on white, never for text**. `--accent` `#2072DF` (same hue, darkened) for text, links, the A–Z letters and focus: 4.63:1 on white (AA). Ink on `--accent-fill` is 9.7:1. | The single pop |
| `--bloom-mist`, `--bloom-powder`, `--bloom-cornflower`, `--bloom-navy` | `#E6F1FF`, `#BFDBFF`, `#5A9BF0`, `#123F7D` (2026-10-17) | The hero bloom only (with `--accent-fill` and `--accent`). Same hue as the accent. Fills only, never text. |
| `--border` | `#E6E6E6` (decorative only, never for text) | Dividers |
| `--paper` | `#FBFAF8` (added 2026-10-16) | Off-white paper: the white tissue card on pink and the interest notes |

Rules:
- The accent is used sparingly. If everything pops, nothing does.
- Body text must reach at least 4.5:1 contrast (WCAG AA). The accent must also pass if it's used for text.

## 4. Typography
Three directions to compare in `design/specimen.html` (all Google Fonts, free):

| Direction | Display (year, headings) | Body | Mono (red lists, nav, labels) | Feel |
|---|---|---|---|---|
| A · Bold condensed | Anton, uppercase | Inter | JetBrains Mono | Closest to the reference. Loud, confident |
| B · Editorial serif | Instrument Serif | Inter | IBM Plex Mono | Calm, grown-up, a little literary |
| C · Friendly grotesk | Bricolage Grotesque | DM Sans | DM Mono | Warm, approachable, playful without being loud |

**Current type (Jayanth, 2026-10-17), replaces Direction A below:**
| Token | Font | Size | Use |
|---|---|---|---|
| `--font-body` | Meshed Display **Bold** (700) | `--text-body` 18px, line height 1.5 | All body text, buttons, index items, card text |
| `--font-display` | Meshed Display **Black** (900) | `--text-h1` clamp(40–57px), `--text-h2` 32px, line height 1.1 | Headings and titles (`.display`). Display moments (hero line, About year) keep their own large sizes. |
| `--font-nav` | Mamenchisa (one weight, no faux bold) | 18px, same as body | Not used since the menu was removed (2026-10-17); the bottom-left Contact is Meshed Display Bold (`--font-body`, `--weight-body`) |
| `--font-mono` | JetBrains Mono (unchanged) | 13px | Small labels |
- Why these sizes: Butterick recommends 15–25px body text for websites (practicaltypography.com/point-size.html); Material 3 Body Large is 16px/24px, Display Large 57px, Headline Large 32px (androidx TypeScaleTokens.kt). Body is nudged to 18px because Meshed's hairlines are thin (judgment, not sourced).
- Meshed's hyphen and dashes are 10-unit hairlines, so `unicode-range` hands `- – —` to Inter. Neither display font has `→`; Mamenchisa lacks `é`. Those fall back to Inter.
- Licenses (read from each font's own file): Meshed Display is free for personal and commercial use, files may not be modified (shipped byte-identical). Mamenchisa is a Drizy Studio demo, **personal use only**; its license names "a portfolio or individual work that does not make a profit" as allowed. Whether a job-search portfolio counts is Jayanth's call; a commercial license is sold by Drizy Studio.
- Risk to readability: Meshed Display is a high-contrast display face, not a text face. Watch long paragraphs (case study) for strain.

**Serif candidates (Jayanth, 2026-10-17):** Playfair Display, LTC Bodoni 175, Freight Display Pro, compared in `design/display-fonts.html`. Playfair is SIL OFL (free to self-host). The other two are paid (inferred: LTC Bodoni 175 from Lanston/P22, Freight Display Pro from Darden Studio); not installed here, so they don't render in the specimen yet. A web license is needed before either ships. Anton stays until one is picked.

**Chosen: A · Bold condensed** (Jayanth, 2026-10-16): `--font-display` Anton (uppercase), `--font-body` Inter, `--font-mono` JetBrains Mono.

Draft scale (px, desktop): display XL `clamp(96, 18vw, 260)` · H1 48 · H2 32 · body 17/1.6 · small 14 · mono labels 13, uppercase, +0.06em tracking. Body line length max 62ch.

## 5. Spacing and layout
Draft, 2026-10-16:
- Spacing scale (`--space-1`…`9`): 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Nothing outside the scale.
- Page gutter: 32px desktop, 16px phone.
- Reading width: 62ch for paragraphs. Case study body max ~720px.
- Breakpoints: about grid stacks below 960px (side lists need room); gutter and nav switch below 760px.
- About grid: 3 columns (year + year | face | red lists). On phones: year and list share a row, face in between.
- ~~No page scrolls on laptop/desktop screens~~ **Retired 2026-10-16: pages may scroll (scroll-driven site).** Previously: Each page fits one screen; sizes scale with viewport height (`vh`). Checked at 1280×720, 1366×768, 1440×900 and 1920×1080. Phones (below 960px wide) may scroll (decided by Jayanth, 2026-10-16).
- About page: portrait column 220–360px, portrait capped at 46% of screen height (made smaller on Jayanth's request, 2026-10-16). Intro sits right-aligned between the two red lists.
- Click targets at least 44×44px, matching the Stage Zero lesson.

## 6. Motion
Draft, 2026-10-16. Motion should feel **calm**: smooth, quick to settle, never bouncy for long.
- Tokens: `--dur-fast` 150ms (hovers, presses), `--dur-base` 250ms (fades, small moves), `--dur-slow` 450ms (page-level and the lid). Easing `--ease-out` = `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Signature moment:** the head lid lifts and the items come out (from `prototypes/framer-lid`). One soft spring, settling in under ~600ms. Items stagger by ~40ms.
- **Notes:** clicking an item opens a note card (*The Last of Us* / *Ghost of Tsushima* style). The card fades and scales in from 0.96 to 1 over 250ms. Focus moves into the note and returns to the item on close (Esc closes).
- **Small touches:** the face tilts slightly on hover; buttons lift 2px.
- **Built 2026-10-16** (`src/components/HeadLid.tsx`, `NoteCard.tsx`): 8 doodles (no dog), compact burst that stays on screen at 1280×720 and up, notes open as a tilted paper card. The prototype's floating doodles and bobbing hint were dropped to follow the no-loop rule. The doodles' own animated WebP loops (spinning wheel, swaying plant) stay, since they only play after the visitor opens the head.
- **Phones:** the head is sized so the open burst fits the screen width, and it makes room above itself when opened instead of covering the nav and red list.
- **Not allowed:** looping or ambient animation, scroll-jacking, anything that delays reading the facts.
- `prefers-reduced-motion`: no movement; the lid and notes just appear and disappear (instant or a 150ms fade).

## 7. Components
| Component | Variants | States | Notes |
|---|---|---|---|
| Button / link | TBD | hover, focus, active | |
| Nav | **Removed (Jayanth, 2026-10-17):** no mark, no menu, no full-screen index anywhere. Only Contact remains: bottom-left, once the hero has turned blue, opening the contact card (`Nav.tsx`, `.nav-contact`). Navigation is the A–Z letters, their pages and the roll box. | Contact: fades and rises in on blue; underline on hover. | Earlier versions (huyml.co-style menu, SilkBall mark, aiu.is index) are in git history. |
| Index menu | **Removed (Jayanth, 2026-10-17)** with the rest of the menu. | | In git history (`IndexMenu.tsx`). |
| Letter grid (`LetterGrid`, 2026-10-17) | Across the hero's first screen, from Jayanth's second sketch: an even 7×5 grid over the whole stage (equal column widths, equal row heights). Row 1: C D E F G (columns 3–7; columns 1–2 are the nav). Left block, columns 1–3: A B H / L M N / R S T / X. Right block, columns 5–7: I J K / O P Q / U V W / Y Z. Column 4 is the silhouette. **Hidden on phones** (below 760px). | Clickable letters (A Arsenal, C Cooking, D Drake, F Football, G Gaming, O One Piece, P Plants, R Running, from about-me.md §1b) always carry a small `--pink` amoeba (`BlobLetter`, after aiu.is): lumpy and off-centre at rest, with the letter white where it overlaps. On hover/focus it **keeps its size and place** and only ripples briefly (Jayanth, 2026-10-17: no growing) (a few hundred ms, then stops; reduced motion jumps straight to the end state). No grain. Click turns the page to vapour and opens that letter's own page (see Letter page below; the head note no longer opens from here). Letters swell toward a fine cursor. **On scroll the letters stay where they are and the zoom passes over them:** after each video seek, `Hero.tsx` samples the frame in a 192px canvas and fades out (and makes `inert`) every letter whose spot is no longer white; a `darken` blend hides them behind the silhouette's soft edges. At the very top, letters over the body (e.g. H, I, T at 1024px) are already hidden. Nothing takes clicks or focus once on the pink. | `--text-letters` **24px** fixed (Jayanth, 2026-10-17), `--accent`. The blob is drawn at 1.6× the letter, so it scales with the type; the button keeps a 44px tap target. **10 letters are lowercase, and each letter gets one of eight fonts, both picked at random on every visit:** bold Anton, Archivo Black; italic Playfair Display Italic, Instrument Serif Italic; sans Inter, Space Grotesk; serif DM Serif Display, Bodoni Moda (tokens `--font-letter-*`, all SIL OFL via Fontsource). The resting blob is the cue that a letter is clickable. |
| Roll box (`RollBox`, 2026-10-17) | Hero row 1, columns 1–2 (where the nav was), same 7×5 grid as the A–Z; full width of the top row on phones. A four-sided box seen edge-on: collage (`src/assets/box/collage.webp`, from Jayanth's Group 2, 133 KB) and "jaykay 2026" (`jaykay-2026.svg`, Group 4) alternate. Visitors land on the collage. Sized to 72% of its cell (smaller on Jayanth's request, 2026-10-17; was 92%), centred in it. | Each scroll gesture (one continuous scroll, momentum included) rolls it a quarter turn: down tips the front face up and away and brings the next up from below; up rolls back. The page scrolls normally (no scroll-jacking). Click/Enter: always the landing page (already there: smooth scroll to top). **Always on screen on the landing page** (Jayanth, 2026-10-17): fixed to the viewport (z-index 20, under the nav and cards), so it stays in the top-left past the hero and over the sections after it; the bloom and the flood never hide it, unlike the letters. **A letter click turns it to vapour with everything else** (its front face, sampled as dots; Jayanth, 2026-10-17); it isn't shown on letter pages. Reduced motion: faces swap instantly. | Link labelled "jaykay, home"; faces are decorative. |
| Letter page (`LetterPage`, 2026-10-17, after aiu.is) | One real page per clickable letter, at `/about-me` (A, the about-me article; was `/arsenal`, Jayanth, 2026-10-17), `/cooking`, `/drake`, `/football`, `/gaming`, `/one-piece`, `/plants`, `/running` (`src/content/letters.ts`). **Layout (Jayanth, 2026-10-17, after aiu.is's article pages):** an empty page with one column (`--reading`, 62ch) centred across the page, starting 20% of the way down (not centred vertically, like the reference). **Only the text scrolls** (Jayanth, 2026-10-17): the page is one fixed screen; the column scrolls inside it, scrollbar hidden, fading out through the top 12–20% of the screen (fully clear by the cross) and in at the bottom edge; it takes keyboard focus on arrival so arrow keys and space scroll it: heading (topic, `--text-h1`), subheading (note title, `--text-h2`), then paragraphs (`--text-body`, **always justified**), all in `--accent`, sentence case. No doodle, no big letter, no previous / next. No nav and no roll box; a hand-drawn cross (`CloseCross`) at the right end of the heading row, flush with the text's right edge, is the way back (Jayanth, 2026-10-17). It scrolls with the text; Esc works from anywhere. | **Vapour transition (`vapor.ts`, Jayanth, 2026-10-17, in the spirit of React Bits Pro's "Vapor Type", written from scratch, not installed):** **leaving** (letter click, the close cross or Esc), everything marked `data-vapor` is redrawn and sampled into fine 2px dots from the real letter shapes (and the blobs behind the clickable letters), then the dots let go in a sweep out from the click and drift up and away, wobbling and fading (~0.4s sweep, ~0.9s drift); the hero's bloom fades. The route changes once the sweep has passed, so the vapour is still drifting as the next page arrives. **Arriving** on a letter page, its text condenses out of a loose cloud of dots, left to right (~0.8s), then the real text takes over. Back from a page, focus returns to its letter. The close cross condenses in and vaporises with the text. Reduced motion: no vapour, only the page fade. The browser back button skips the vapour. | Content: title, line and doodle from `notes.ts` (about-me.md §1b); longer text goes in each entry's `more`, written by Jayanth. **Motion exception:** the vapour is louder than §6's "calm", allowed for letter navigation only. |
| Close cross (`CloseCross`, 2026-10-17) | Letter pages only, in the heading row at the right end of the text column, vertically centred on the heading, its strokes flush with the text's right edge; 64px target. A hand-drawn cross traced from Jayanth's sketch: one long stroke falling top-left to bottom-right, a shorter one crossing it from bottom-left, slightly curled ends. 2.5px round stroke in `--accent`, no box or "X" glyph. | No hover animation (Jayanth, 2026-10-17). Click or Esc: the page turns to vapour and the landing page opens with focus on the letter. Focus ring in `--accent`. | Labelled "Close, back to the start". |
| Letter preview (`LetterPreview`, 2026-10-17, in the spirit of React Bits Pro's "Hover Preview", written from scratch, not installed) | A small card beside a clickable A–Z letter, top-aligned with it, `min(320px, 30vw)` wide: mono kicker ("A · Read"), the article title (display, `--text-h2`), then its opening lines, justified and hyphenated, clamped to 4 lines. Opens to the right; flips to the left when it would pass the right edge. `--bg` card, 1px `--border`, `--space-4` radius, all text `--accent`. Hidden on phones (no A–Z there). | Shows on hover and on keyboard focus (`aria-describedby` on the letter); springs out from the letter's side (scale 0.85→1, small slide, ~0.35s, light bounce) and fades out in 0.12s. Closes as soon as the page scrolls. Turns to vapour with the page on click. Reduced motion: Motion's reduced-motion setting drops the movement. | The `[Needs your answer: …]` drafting notes are stripped from the excerpt. |
| Case study card | TBD | | |

## 8. Imagery and illustration
- **No photo of Jayanth** (decided 2026-10-16). Jayanth appears only as the **portrait illustration**, which is the face in the head-lid interaction.
- The illustration is `prototypes/framer-lid/portrait-cutout.png`: black ink line art on a transparent background (1254 × 1254), checked 2026-10-16. It already fits the monochrome palette. The accent color is optional inside it.
- Doodle style rules (from `prototypes/doodles/`): TBD. They have to fit the monochrome look and the "not childish" rule.

## 9. Accessibility
- Visible focus on every interactive element
- All images have alt text, and decorative ones are marked as decorative
- Full keyboard navigation
