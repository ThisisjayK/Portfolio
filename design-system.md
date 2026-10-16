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

### Page decisions (Jayanth, 2026-10-16)
1. **Home page stays blank for now.** Work on the other tabs first. ⚠ Risk to revisit before launch: LinkedIn and résumé links land on `/`. Either the home page gets content by 2026-10-20, or the shared link points to the about page.
2. **Facts without clicking: agreed.** Name, intro, what Jayanth does and contact are always visible. The head and its notes are a bonus layer.
3. **Playground: built after launch, but the tab exists in v1** (e.g. a simple "in progress" page).

## 3. Color
Decided by Jayanth, 2026-10-16: **light theme only. Monochrome (mostly white and black) with a small pop of color.** No dark mode in v1.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--fg` | `#111111` (18.9:1 on white) | Body text, illustration ink |
| `--muted` | `#6B6B6B` (5.3:1 on white) | Secondary text |
| `--accent` | **`#D62B1F` red** (Jayanth, 2026-10-16). 4.97:1 on white, so it passes AA for small text. | The single pop: side lists, links, focus |
| `--border` | `#E6E6E6` (decorative only, never for text) | Dividers |

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

**Chosen: A · Bold condensed** (Jayanth, 2026-10-16): `--font-display` Anton (uppercase), `--font-body` Inter, `--font-mono` JetBrains Mono.

Draft scale (px, desktop): display XL `clamp(96, 18vw, 260)` · H1 48 · H2 32 · body 17/1.6 · small 14 · mono labels 13, uppercase, +0.06em tracking. Body line length max 62ch.

## 5. Spacing and layout
Draft, 2026-10-16:
- Spacing scale (`--space-1`…`9`): 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Nothing outside the scale.
- Page gutter: 32px desktop, 16px phone.
- Reading width: 62ch for paragraphs. Case study body max ~720px.
- Breakpoints: about grid stacks below 960px (side lists need room); gutter and nav switch below 760px.
- About grid: 3 columns (year + year | face | red lists). On phones: year and list share a row, face in between.
- **No page scrolls on laptop/desktop screens** (Jayanth, 2026-10-16). Each page fits one screen; sizes scale with viewport height (`vh`). Checked at 1280×720, 1366×768, 1440×900 and 1920×1080. Phones (below 960px wide) still scroll; see the open question in product.md.
- About page: portrait column 220–360px, portrait capped at 46% of screen height (made smaller on Jayanth's request, 2026-10-16). Intro sits right-aligned between the two red lists.
- Click targets at least 44×44px, matching the Stage Zero lesson.

## 6. Motion
Draft, 2026-10-16. Motion should feel **calm**: smooth, quick to settle, never bouncy for long.
- Tokens: `--dur-fast` 150ms (hovers, presses), `--dur-base` 250ms (fades, small moves), `--dur-slow` 450ms (page-level and the lid). Easing `--ease-out` = `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Signature moment:** the head lid lifts and the items come out (from `prototypes/framer-lid`). One soft spring, settling in under ~600ms. Items stagger by ~40ms.
- **Notes:** clicking an item opens a note card (*The Last of Us* / *Ghost of Tsushima* style). The card fades and scales in from 0.96 to 1 over 250ms. Focus moves into the note and returns to the item on close (Esc closes).
- **Small touches:** the face tilts slightly on hover; buttons lift 2px.
- **Not allowed:** looping or ambient animation, scroll-jacking, anything that delays reading the facts.
- `prefers-reduced-motion`: no movement; the lid and notes just appear and disappear (instant or a 150ms fade).

## 7. Components
| Component | Variants | States | Notes |
|---|---|---|---|
| Button / link | TBD | hover, focus, active | |
| Nav | TBD | | |
| Case study card | TBD | | |

## 8. Imagery and illustration
- **No photo of Jayanth** (decided 2026-10-16). Jayanth appears only as the **portrait illustration**, which is the face in the head-lid interaction.
- The illustration is `prototypes/framer-lid/portrait-cutout.png`: black ink line art on a transparent background (1254 × 1254), checked 2026-10-16. It already fits the monochrome palette. The accent color is optional inside it.
- Doodle style rules (from `prototypes/doodles/`): TBD. They have to fit the monochrome look and the "not childish" rule.

## 9. Accessibility
- Visible focus on every interactive element
- All images have alt text, and decorative ones are marked as decorative
- Full keyboard navigation
