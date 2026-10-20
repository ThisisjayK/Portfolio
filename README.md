# Portfolio

My personal site: who I am, where I'm from, what I studied, where I've worked, and what I love outside work.

**Live:** https://thisisjayk.github.io/Portfolio/

## What's on it

- **Home**, told as a story from top to bottom: a hello, a globe that draws my route from Hyderabad to Boston to Atlanta as you scroll, education, my work timeline, a few things I love, what I want to do next, and an "Ask me something" box.
- **About:** About me, Work and Skills.
- **Interests:** Cooking (a menu of dishes, each with its ingredients labelled on the photo), Drake (a playlist player and a few things I own), Arsenal F.C (including volunteering at the FIFA World Cup 2026 in Boston), and The ocean.
- A "lost at sea" 404 page for anything else.

The index on the left lists every page. On phones it opens from the Index button.

## Built with

| | |
|---|---|
| App | [Vite](https://vite.dev), [React](https://react.dev), TypeScript, [React Router](https://reactrouter.com) |
| Motion | [Motion](https://motion.dev) (`motion/react`, loaded with `LazyMotion`) |
| Graphics | Raw WebGL for the hero's blue bloom, 2D canvas for the rolling road, [d3-geo](https://d3js.org/d3-geo) and [world-atlas](https://github.com/topojson/world-atlas) for the globe, [ogl](https://github.com/oframe/ogl) for the photo carousel |
| Styling | Plain CSS with design tokens (`src/styles/tokens.css`), one file per component |
| Hosting | GitHub Pages, deployed by GitHub Actions |

No CMS and no backend. Page text lives in TypeScript files under `src/content/`.

## Run it locally

You need Node 22 (the version CI uses).

```bash
npm install
npm run dev
```

The site opens at http://localhost:5173/Portfolio/.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, build into `dist/`, and copy `index.html` to `404.html` so direct links to inner pages load |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run typecheck` | TypeScript only |
| `npm run playlists` | Refresh the Drake page's song previews from Apple's public iTunes Search API |

## Deploying

Every push to `main` runs `.github/workflows/deploy.yml`: `npm ci`, `npm run build`, then publishes `dist/` to GitHub Pages. Work happens on the `v2` branch and reaches `main` through pull requests.

The site is served from `/Portfolio/` (`base` in `vite.config.ts`). Inner pages like `/skills` are single-page-app routes, served through the `404.html` copy.

## Project layout

```
src/
  pages/        Home, letter pages (About me, Work, Skills, interests), dish pages, 404
  components/   Hero, GlobeRoute, RollingRoad, RackFocus, AskBox, IndexNav, SkillsList, ...
  content/      All page text and data (about.ts, letters.ts, skills.ts, dishes.ts, ...)
  styles/       tokens.css, global.css, fonts
  assets/       Photos, fonts, illustrations
public/         Favicons, link preview image, llms.txt and a plain-text version of the site
design/         Design labs and specimens (not shipped)
prototypes/     Earlier experiments (not shipped)
scripts/        The playlist preview resolver
```

`architecture.md` holds the decision log (every design and build decision, with the reason) and `design-system.md` the tokens and components. Personal planning notes are kept out of the repo on purpose.

## For AI tools and search

A plain-text version of the site is at [`/jayanth-kappagantula.md`](https://thisisjayk.github.io/Portfolio/jayanth-kappagantula.md), listed in [`/llms.txt`](https://thisisjayk.github.io/Portfolio/llms.txt).

## Credits

- **Fonts:** Alte Haas Grotesk by Yann Le Coroller (freeware; its licence file ships beside it in `public/fonts/`); JetBrains Mono, Inter and the letter pages' display fonts via Fontsource (SIL Open Font License).
- **Map data:** world-atlas by Mike Bostock (ISC), from Natural Earth.
- **Photo carousel:** adapted from [React Bits](https://reactbits.dev)' FlexCarousel.
- **Inspiration:** the index after [aiu.is](https://aiu.is), the playful about page after [huyml.co](https://huyml.co), and the scroll sections after [neutomni.com](https://neutomni.com). Ideas and structure only; everything here is drawn, written and built for this site.
- **Music previews** on the Drake page are 30-second clips and cover art served by Apple.

## Reuse

There's no license file, so the code, writing and photos aren't licensed for reuse. Ask me first: jayanthadityaaa@gmail.com.

Built with help from [Claude Code](https://claude.com/claude-code).
