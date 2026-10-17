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
| Fonts | Self-hosted **Anton, Inter, JetBrains Mono** (WOFF2, Latin subset, `font-display: swap`, display font preloaded) | Faster and steadier than loading from Google Fonts. | Google Fonts CDN (fine for the specimen, slower in production). |
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
  components/      # HeadLid, NoteCard, ContactCard, Nav, PageTransition
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
