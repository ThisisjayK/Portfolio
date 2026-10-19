# Architecture

How the site is built, structured and deployed. Every decision gets logged with the reason for it, so it can be revisited later.

Status: **stack approved by Jayanth, 2026-10-16.** Vite + React + TypeScript + Motion, hosted on GitHub Pages at the existing address. Everything else in this file is a working draft.

## 1. Requirements that drive the architecture
- **Motion-rich but fast.** Jayanth wants the kind of animations, motion design and transitions in https://motion.dev/examples?platform=react and https://jitter.video/templates/, on a site that is "very smooth and quick, no lags whatsoever" (Jayanth, 2026-10-16).
- **The 90-second rule.** Facts must be readable without waiting on or clicking any animation (design-system.md).
- **Interactive pieces:** the head-lid lift with clickable items that open notes (`prototypes/framer-lid`, written in React for Framer), page transitions between tabs, and the contact card.
- **Replace the old site at the same address.** The old site is live at https://thisisjayk.github.io/Portfolio/, and links to it are already out with recruiters (product.md).
- **Link previews** (title, description, image) for LinkedIn, Slack and email.
- **Deadline:** live by 2026-10-20.

## 2. Stack (approved 2026-10-16)
| Layer | Proposal | Why | Alternatives considered |
|---|---|---|---|
| Framework | **Vite + React + TypeScript** | Motion's React examples drop straight in. The lid prototype is already React, so it ports with little change. A small single-page app makes tab-to-tab transitions seamless. | Astro (ships less JS, but cross-page Motion transitions are harder). Next.js (more than a 5-page site needs). Framer (fast to design, but can't publish to the GitHub Pages address). |
| Animation | **Motion** (`motion/react`), loaded with `LazyMotion` + `m` components to keep the bundle small | It's the library behind the motion.dev examples. It runs on the GPU-friendly properties (transform, opacity), supports springs, layout animation and `AnimatePresence` for page and note transitions, and respects reduced motion. | CSS only (fine for hovers, which we'll still use, but weak for orchestration). GSAP (great, but a second library). |
| Jitter designs | **Rebuild them in Motion where possible.** Otherwise export from Jitter as a short, muted, looping-off **WebM/MP4** (or Lottie, if the export supports it: unconfirmed), lazy-loaded and never blocking the facts. | Jitter is a design tool that exports files; it isn't a web library. Video is light to play. A full Lottie player can add a few hundred KB of JS. Unverified estimate: check the actual size before adopting it. | Lottie via dotLottie player (smaller than lottie-web; measure before use). |
| Styling | **Plain CSS with the design-system.md tokens** (CSS variables), one CSS file per component | Zero runtime cost. The tokens are already written. | Tailwind (fast, but another layer to learn and configure under a deadline). |
| Routing | React Router with **hash-free paths** and the GitHub Pages SPA 404 fallback | Clean URLs like `/about`, `/work/stage-zero` | Hash routing (`/#/about`): simpler, but uglier links to forward. |
| Content | Case study and about text in **TypeScript/MDX files in the repo**, pulled from about-me.md | No CMS to set up. Everything is versioned. | Notion or CMS (overkill for one case study). |
| Fonts | Self-hosted **Meshed Display (Bold, Black), JetBrains Mono**, with Inter as a glyph fallback (`font-display: swap`; files shipped unmodified, so no subsetting). Anton removed 2026-10-17; Mamenchisa unloaded 2026-10-17 (file kept). | Faster and steadier than loading from Google Fonts. | Google Fonts CDN (fine for the specimen, slower in production). |
| Hosting | **GitHub Pages**, repo `ThisisjayK/Portfolio`, deployed by a GitHub Action on push to `main` | Replaces the old site **at the same address**, so every link already sent shows the new site. Free, no badge. | Vercel (great, but a new address, and the old links would still show the old site). |
| Résumé PDF | TBD | | Generated from about-me.md, or exported by hand |

## 3. Performance budget ("no lags")
These are targets for v1, checked with Lighthouse (mobile) and Chrome DevTools before launch.
| Measure | Budget |
|---|---|
| JavaScript, first load (gzipped) | ≤ 120 KB (React + Motion via LazyMotion + app code) |
| Largest Contentful Paint (mobile, 4G) | ≤ 2.0 s |
| Interaction to Next Paint | ≤ 100 ms |
| Cumulative Layout Shift | ≤ 0.05 |
| Animation frame rate | 60 fps on a mid-range phone, no dropped frames during the lid lift or page transitions |
| Images | Portrait as an optimized WebP/AVIF or SVG. Every image sized and lazy-loaded below the fold. |
| Doodles (animated WebP) | ~2 MB total for 8. Loaded only after first hover/focus on the head, never on page load. Re-encode smaller if needed. |
| Hero scroll video (AI-generated silhouette) | Target ≤ 3 MB, short (≈5–8 s), encoded with frequent keyframes so scrubbing is smooth; poster image shown first; facts rendered as HTML, never inside the video. Unverified estimate; measure the real file. |
| Video (Jitter exports) | ≤ 500 KB each, lazy-loaded, never in the first paint |

Rules that keep it smooth:
1. Animate only `transform` and `opacity`. Never animate width, height, top/left, or blur on large areas.
2. Nothing animates before the facts are on screen. Entrance animations are short (≤ 450ms) and never hide text that has already loaded.
3. Lazy-load anything below the fold: notes, case study images, Jitter video.
4. Respect `prefers-reduced-motion`.
5. Test on a real phone, not just a laptop.

## 4. Folder structure (proposed)
```
src/
  pages/           # Home, About, Work/StageZero, Playground, Contact
  components/      # Hero, LetterGrid, RollBox, Nav, TissueCard (Contact), CloseCross
  content/         # about + case study text (from about-me.md)
  styles/          # tokens.css (from design-system.md), global.css
  assets/          # portrait, doodles, fonts
public/            # résumé PDF, social preview image, 404.html
design/            # specimen.html and other design explorations (not shipped)
prototypes/        # yesterday's experiments; source for HeadLid, not shipped as-is
```

## 5. Build and deploy
- Local dev: `npm run dev` (Vite). Preview through `.claude/launch.json`.
- Build output: `dist/`
- Deploy: GitHub Action on push to `main` publishes `dist/` to GitHub Pages.
- Address: https://thisisjayk.github.io/Portfolio/ (Vite `base: '/Portfolio/'`). Custom domain after launch.

## 6. Quality checks
- Typecheck: `tsc --noEmit`
- Accessibility: keyboard-only pass, axe DevTools scan, reduced-motion pass
- Links: every link clicked once before launch
- Performance: the Section 3 budget, checked with Lighthouse mobile

## 7. Source control
- **Reusing the `ThisisjayK/Portfolio` GitHub repo is proposed**, so Pages keeps the same address. The old history stays on GitHub. The new site goes in on a fresh branch and replaces `main` at launch. **Replacing `main` and deploying happens only after Jayanth says go.**
- The local folder isn't a git repo right now. Set-up step: clone or init and connect to the remote. TBD with Jayanth.

## 8. Decision log
| Date | Decision | Reason |
|---|---|---|
| 2026-10-16 | Vite + React + TypeScript + Motion | Motion's React examples and the existing React lid prototype drop straight in. A small single-page app keeps tab transitions smooth. |
| 2026-10-16 | GitHub Pages at https://thisisjayk.github.io/Portfolio/ | Replaces the live old site at the same address, so links already sent to recruiters show the new site. Free, no badge. |
| 2026-10-16 | Plain CSS with design-system tokens | No runtime cost; the tokens are already defined. |
| 2026-10-16 | Jitter designs rebuilt in Motion where possible, otherwise as lazy-loaded video | Keeps the performance budget ("no lags"). |
| 2026-10-16 | Nav mark is a code-drawn silky pink ball (`SilkBall`, raw WebGL fragment shader, no 3D library) | Jayanth chose code over a Higgsfield video: exact `--pink`, sharp at any size, loops perfectly, a few KB instead of a video. Pauses when hidden or on the pink. |
| 2026-10-16 | Nav rebuilt after huyml.co's menu: "Menu" label, big stacked words, hover arrow + blur on the rest; order Work, About, Playground, Contact | Jayanth's reference. Work first because it's what a recruiter wants (order confirmed by Jayanth, 2026-10-16). Blur uses CSS `:has()`, no JS. |
| 2026-10-16 | Interest notes use our own WebGL crumple (`CrumpleNotes`), inspired by Framer's CrumpledPaperReveal | The Framer module imports the `framer` package and has no license, so it's reimplemented. One canvas, a 28×28 sheet per note blended between flat and a creased ball; doodles (~74 KB, static WebP) are in the texture, words are real HTML. Drawn only on scroll, not every frame. |
| 2026-10-17 | Full-screen index menu (`IndexMenu`) after aiu.is, opened from "Menu"; the hero stays on the home page | Jayanth wanted aiu.is's navigation. The home page already holds the scroll-driven hero, so the index lives in an overlay instead of replacing it. Adds ~2 KB gzipped JS (bundle was already 122 KB, over the 120 KB budget). |
| 2026-10-17 | Type: Meshed Display Bold body (18px/1.5), Meshed Display Black headings (H1 40–57px, H2 32px), Mamenchisa for navigation at body size | Jayanth's choice. Sizes from Butterick (15–25px body) and Material 3's type scale. Meshed's near-invisible hyphens routed to Inter via unicode-range, since its license forbids editing the files. Mamenchisa is personal-use only; its license allows non-profit portfolios. |
| 2026-10-17 | Hero A–Z letters draw from 8 fonts at random (2 bold, 2 italic, 2 sans, 2 serif), all OFL via Fontsource, Latin subsets only | Jayanth asked for a random font mix. Free licenses avoid the demo/paid-font questions. Only fonts actually shown are downloaded, and the grid is hidden on phones, so phones shouldn't fetch them (inferred, not measured). |
| 2026-10-17 | Accent switched from pink to blue: `--accent-fill` #8BBDFF, text-safe `--accent` #2072DF; token `--pink` renamed `--accent-fill` | Jayanth's choice. #8BBDFF is 1.94:1 on white, so text uses a darker shade of the same hue (4.63:1). |
| 2026-10-17 | Roll box in the hero's top-left: one quarter turn per scroll gesture, no scroll-jacking; Group 2 rasterised to a 133 KB WebP | Jayanth's design. The Group 2 SVG was 18.6 MB (14 embedded photos), far over the budget. Gesture = scroll events less than 250 ms apart. |
| 2026-10-17 | Hero silhouette video replaced by `BlueBloom`, a WebGL shader of five blue layers with grain; letters hide by geometry, not pixel reads | Jayanth wanted colour blooms instead of the silhouette, in shades of the current blue. A shader lands exactly on the tokens, stays sharp at any size, costs a few KB instead of a ~2 MB video, and seeks with no lag. Same mechanism as `SilkBall`. Without WebGL: plain white, letters hide only at the flood. |
| 2026-10-17 | Letters open real pages (`/<slug>`, `LetterPage`) with a canvas "shatter" transition (`shatter.ts`) instead of the note card | Jayanth wanted aiu.is's behaviour: a full page per letter, the index breaking apart on the way. Real routes keep the back button and shareable links. The shatter draws chips on one temporary 2D canvas instead of splitting the DOM into hundreds of moving spans, so it stays cheap. |
| 2026-10-17 | Letter transition changed from glitch + chip shatter to a vapour effect (`vapor.ts`, replaces `shatter.ts`) | Jayanth wanted it like React Bits Pro's Vapor Type, "not literally". Written from scratch instead of installing the Pro component (needs a license key and an extra registry). Dots are sampled from the real glyphs on a temporary canvas outside React, so the vapour keeps drifting across the route change. |
| 2026-10-17 | Letter A holds an about-me article at `/about-me` (was Arsenal); articles live in `src/content/letters.ts` and can set their own heading and subheading. Nav matches routes by whole path segment | Jayanth asked for an article about himself on the A page. `/about-me` made the nav think it was on `/about` (prefix match), so it now matches `/about` or `/about/…` only. |
| 2026-10-17 | Removed the nav menu, the full-screen index, the Work card and the About and Playground pages | Jayanth's call: the A–Z letters and their pages are the navigation now. Old /work, /about and /playground links fall through to the home page; /contact still opens the contact card. The home page's "About me" button opens the /about-me letter page. HeadLid, NoteCard, CrumpleNotes and SilkBall are now unused but kept for now. |
| 2026-10-17 | Deleted the code left unused by that removal: `HeadLid`, `NoteCard`, `CrumpleNotes`, `SilkBall`, `TextReveal`, `src/content/interests.ts`, `src/content/heroTimeline.ts`, the `favorites`/`whatIDo` exports, `--font-nav` and the Mamenchisa `@font-face`; `notes.ts` no longer imports the eight doodle WebPs | Jayanth confirmed each deletion. Nothing imported these files, but the doodles (via `notes.ts` → `letters.ts`) and the Mamenchisa font were still emitted into the build: output went from 3,312 KB to 1,280 KB (WebP 2,181 KB → 133 KB, −16 KB font, JS −0.6 KB). Image and font files stay in `src/assets/`. |
| 2026-10-17 | Grid hop replaces the vapour (`pageHop.ts`; vapor.ts removed). New home sections after the blue screen: `RollingRoad`, `RackFocus`, `AskBox`; `RevealText` for line-by-line blur reveals | Jayanth picked these from the motion lab prototype (design/motion-lab.html). The grid hop reuses the vapour's page rasteriser and draws 32px cells instead of dots. The Ask box uses fixed answers from about-me.md (no AI, no cost, works on GitHub Pages). JS bundle is now 132.6 KB gzipped, over the 120 KB budget (was 129.9 KB). |
| 2026-10-17 | `public/llms.txt` and `public/jayanth-kappagantula.md` (not about-me.md: .gitignore keeps that name private), plus `<link rel="alternate" type="text/markdown">` in index.html | A clean text version for recruiters' AI tools and search (idea from aiu.is). Facts only from about-me.md. Note: letter pages are SPA routes served through 404.html on GitHub Pages, so crawlers get a 404 status there; the .md file is a real 200. |
| 2026-10-17 | A–Z letters off the landing page; a fixed index nav (`IndexNav`) after aiu.is's, with a heavy strike-through wipe, takes over the letters' preview and grid hop | Jayanth wanted a proper index like aiu.is's, with the hover as a thick strike leaving a gap top and bottom. Mounted outside the routed pages so it stays still during the grid hop. Bar and white knockout text share one animated clip-path so they stay in sync. |
| 2026-10-17 | Theme colour #1110E4 everywhere (text, lines, strike, blue sections; first #002FA7, then #1110E4 the same day); white on the blue; bloom re-tinted to its hue; `--ink` / `--surface` context variables | Jayanth's choice. #1110E4 is 9.47:1 on white but ink on it is 1.99:1, so the blue surfaces flip to white text. Context variables let buttons and canvases follow their surface instead of hard-coding ink. |
| 2026-10-17 | Index words in Alte Haas Grotesk Bold (28px items, 32px titles), self-hosted TTF with its licence text in public/fonts | Jayanth's choice, after aiu.is's grotesk index. The freeware licence requires its text file to travel with the font, so it ships publicly beside it. TTF (145 KB) rather than WOFF2: no conversion tool installed here; converting it would shrink it (inferred, roughly half). |
| 2026-10-17 | Roll box face → Jayanth's line drawing (recoloured to `--accent`), jaykay face → white on #1110E4; bloom's solid sky layer removed | Jayanth's choices. The sky amoeba made the hero a long stretch of flat blue with nothing changing; the ripples, halftone and cobalt carry the scroll on their own. The hero's scroll length (520svh) is unchanged. |
| 2026-10-18 | "How I work" section (`HowIWork`, five beliefs with proof captions, line 6 as the Ask box heading) built, then removed the same day; Ask box back to "Ask about me" | Jayanth reviewed it in the preview and didn't like it. Files deleted (never committed); Home and the Ask box restored to their last committed state. |
| 2026-10-18 | Hover preview card removed from the index (`IndexNav` no longer renders `LetterPreview`) | Jayanth didn't need it. Hover and focus now show only the strike-through. `LetterPreview.tsx` is kept, unused (only the unmounted `LetterGrid` imports it). |
| 2026-10-18 | Work page added as a letter page (W, `/work`), listed under About in the index after About me | Jayanth asked for a work page in the About section and picked a role timeline over a case study. Reusing the letter page keeps the layout, grid hop and close cross with no new component. Body is one paragraph per role from about-me.md §3; Stage Zero follows the §8 disclosure policy; the NGO design role is left out until its name and dates exist. `LetterPage.note` is now optional, since Work has no interest note. |
| 2026-10-18 | Ask box rebuilt as the redacted version (`AskBox`): answer only, white bars lift off each line; private questions stay redacted. Prototypes 1–10 kept in `design/ask-lab.html` | Jayanth picked option 9 from the lab and asked for no sources, no "read as" and no interpretation on screen. Answers still come only from about-me.md via `ask.ts`. Bars are measured from the real line wraps and drawn into a layer React never re-renders, so nothing fights the reconciler. |
| 2026-10-18 | Body and headings switched to Alte Haas Grotesk Bold (`--font-body`, `--font-display`); `--weight-heading` 900 → 700; `.display` tracking −0.03em | Jayanth wanted the index nav's font throughout. The font only ships in Bold, so 700 avoids a browser-faked heavier weight. It was already loaded for the index, so no new download; Meshed is no longer fetched. |
| 2026-10-18 | Contact card moved from the right edge to the gap right of the index, bottom-anchored, and now rises from the bottom instead of sliding in from the right | Jayanth marked the spot and asked for it there on every page. Anchoring to `--index-w` keeps it beside the index at any desktop width. |
| 2026-10-18 | `Page` no longer lifts 8px or fades out on exit; it only fades in | Jayanth saw a pause and the text moving up when opening a page from the index. Measured: the 250ms exit fade (AnimatePresence `mode="wait"`) left a blank screen after the hop, and the 8px lift moved the title from 189 to 181px as it appeared. Now the new page mounts ~300ms sooner and nothing moves. |
| 2026-10-18 | `RevealText` shows text that's already on screen at mount in the same frame, instead of waiting for its IntersectionObserver | The real cause of the jump Jayanth still saw: for one frame the words sat 15px low (the reveal's start state), the grid hop rasterised them there, and the real text then appeared 15px higher. Measured after the fix: word positions are identical from the first frame to the end of the hop. Text below the fold still reveals on scroll. |
| 2026-10-18 | `Hero` sets `onPink` from `scrollYProgress.get()` on mount as well as on `'change'` | Bug: after a reload or back navigation past the hero, the progress value was already 1 when Hero mounted, so `'change'` never fired, `onPink` stayed false and the index sat over the blue sections as stray knock-out fragments. Checked in headless Chrome: before the fix, a reload on Rolling road / Rack focus left `nav.index` without `index--away`; after it, a reload at Rolling road, Rack focus and the Ask box hides the index, and it shows again at the top. No new scroll listener. |
| 2026-10-18 | `Hero` also reads its scroll progress on mount to set "on blue" | Motion's 'change' event only fires on a change, so a page loaded already past the hero (reload, back button) never hid the index on the blue sections. Checked: after a reload at the Ask box the index has `index--away`; back at the top it shows again. |
| 2026-10-18 | About me, Work and the interest pages filled with the approved copy (`letters.ts` ARTICLES). Interests are now Cooking (C), Drake (D), Football/Arsenal (F), and The ocean (O, replacing One Piece). Plants (P), Running (R) and Gaming (G) removed | Jayanth wrote the interest stories, chose medium length (150–300 words a page), widened the audience (product.md §2) and dropped plants, running and anime. Arsenal stays on F because A is About me. The old `/one-piece`, `/plants`, `/running` and `/gaming` URLs now fall back to Home. The NGO role shows "[Needs your answer: …]" until its details exist. |
