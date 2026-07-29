import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
// InfiniteMenu is authored in JS (React Bits); no type declaration ships with
// it, and we do not run tsc in the build.
// @ts-expect-error - JS component, no type declaration
import InfiniteMenu from "../components/InfiniteMenu";
// @ts-expect-error - JS component, no type declaration
import CircularGallery from "../components/CircularGallery";
// @ts-expect-error - JS component (React Bits), no type declaration
import FlowingMenu from "../components/FlowingMenu";
// Two logo tiles (transparent background) in each theme's ink colour, so the
// wordmark stays legible over the page's pink (light) / green (dark) paper.
import kickGreen from "../assets/kick-green.svg";
import kickPink from "../assets/kick-pink.svg";
// Case-study cover art lives with its source documents under case-studies/,
// not in src/assets, so the write-up and its artwork stay in one folder. These
// brand-mark cards replaced a charted cover (cover-green/pink.svg), which was
// deleted - git history is the only copy now.
import stageZeroGreen from "../../case-studies/stage-zero-health/assets/logo-card-green.svg";
import stageZeroPink from "../../case-studies/stage-zero-health/assets/logo-card-pink.svg";
// Shared placeholders for the slots that have no write-up yet. They live in
// src/assets rather than a case-study folder because they belong to no project.
import soonCardGreen from "../assets/soon-card-green.svg";
import soonCardPink from "../assets/soon-card-pink.svg";
import frogSleepingSheet from "../assets/frog/sleeping/sleeping_sheet_transparent.png";
import soonTileGreen from "../assets/soon-tile-green.svg";
import soonTilePink from "../assets/soon-tile-pink.svg";
// Official brand logos (in each company's own colour) for the Technical & tools
// skills. Only the tools with an available logo render as a badge; the rest
// fall back to a text chip.
import { BRAND_LOGOS } from "../assets/brand-logos";
// Multicolour brand logos that ship as full SVG art (rendered via <img>).
import twilioLogo from "../assets/logos/twilio.svg";
import sendgridLogo from "../assets/logos/sendgrid.svg";
import excelLogo from "../assets/logos/excel.svg";
import githubLogo from "../assets/logos/github.svg";
import vercelLogo from "../assets/logos/vercel.svg";
import javaLogo from "../assets/logos/java.svg";
import supabaseLogo from "../assets/logos/supabase.svg";
import vscodeLogo from "../assets/logos/vscode.svg";
import slackLogo from "../assets/logos/slack.svg";
import sqlLogo from "../assets/logos/sql.svg";

const IMG_LOGOS: Record<string, { src: string; title: string }> = {
  Twilio: { src: twilioLogo, title: "Twilio" },
  SendGrid: { src: sendgridLogo, title: "SendGrid" },
  "Microsoft Excel": { src: excelLogo, title: "Microsoft Excel" },
  GitHub: { src: githubLogo, title: "GitHub" },
  Vercel: { src: vercelLogo, title: "Vercel" },
  SQL: { src: sqlLogo, title: "SQL" },
  Java: { src: javaLogo, title: "Java" },
  Supabase: { src: supabaseLogo, title: "Supabase" },
  "VS Code": { src: vscodeLogo, title: "Visual Studio Code" },
  Slack: { src: slackLogo, title: "Slack" },
};

// Reads the current theme off <html data-theme> and re-renders when it flips.
function useThemeName(): "dark" | "light" {
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

// Certifications, shown as linked tags in the About aside (each opens its
// verification certificate in a new tab).
const CERT_TAGS: { label: string; url: string }[] = [
  {
    label: "Salesforce Administrator",
    url: "https://drive.google.com/file/d/1WVVU-VpT7sWHzP9OFwQ54xmHf99xEPI2/view",
  },
  {
    label: "Pega System Architect",
    url: "https://drive.google.com/file/d/12JBSuowHIw9UP8M_LhVqcKdovTqa9nqN/view",
  },
  {
    label: "Pega Business Architect",
    url: "https://drive.google.com/file/d/1T7oTZqtkUDIn-s90PQe4k7zEkd0Vlz8u/view",
  },
];

export function About() {
  return (
    <section className="hero">
      <h1 className="about-name">Hey, I&apos;m Jayanth</h1>
      <div className="cols">
        <div>
          <p className="lede">
            An early-career product manager who spent five months as a
            technical PM intern at a pre-seed B2B startup in the MIT
            Incubator program, building early cancer detection tech. Small
            team, a huge learning curve, and enough ambiguity that I had to
            figure out my own footing fast.
          </p>
          <p>
            What that actually meant day to day: writing PRDs that engineers
            could work from without guessing, running sprint planning and
            backlog grooming, and sitting in on bug triage when something
            customer-facing broke. I got comfortable using RICE to decide what
            actually mattered this sprint versus what just felt urgent, and I
            spent a lot of time synthesizing user interviews the team had
            already run, pulling out the patterns that should actually shape
            the roadmap.
          </p>
        </div>
        <div className="aside">
          <p>
            I&apos;m looking for an APM or new-grad product role where I get
            to work with people who are good at what they do, on something
            that actually matters.
          </p>
          <p>
            Outside of work I garden, cook, sing, and watch more anime than
            I&apos;ll admit to in an interview.
          </p>
          <div className="about-certs">
            <span className="about-certs-label">Certified</span>
            <div className="about-certs-tags">
              {CERT_TAGS.map((c) => (
                <a
                  key={c.label}
                  className="chip"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
        sprite: {
          src: frogSleepingSheet,
          frames: SLEEPING_FRAMES,
          fps: SLEEPING_FPS,
          rect: [0.375, 0.485, 0.25, 0.229] as const,
        },
      })),
    ],
    [theme],
  );

  return (
    <section className="block">
      <div className="case-gallery">
        <CircularGallery
          items={items}
          bend={1.5}
          borderRadius={0.05}
          scrollEase={0.05}
          scrollSpeed={6.5}
          font="bold 28px Geist"
          onItemClick={(_i: number, item: { id: CaseId | null }) => {
            if (item?.id) onOpenCase?.(item.id);
          }}
        />
      </div>
    </section>
  );
}

// Props default to {} for the same reason as Work above: the SECTIONS map in
// App.tsx is typed against a prop-less signature.
export function Teardowns({ onOpenKick }: { onOpenKick?: () => void } = {}) {
  const theme = useThemeName();

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
const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Product",
    items: [
      "PRDs & specs",
      "User stories",
      "Roadmap & backlog",
      "Two-week sprints",
      "Bug triage",
      "RICE",
      "Prototyping",
    ],
  },
  {
    group: "Research & discovery",
    items: [
      "User interviews",
      "Survey & interview synthesis",
      "Personas",
      "Journey mapping",
      "TAM / SAM / SOM",
      "Market research",
      "Product teardowns",
    ],
  },
  {
    group: "Technical & tools",
    items: [
      "GA4",
      "Jira",
      "Asana",
      "Miro",
      "Figma",
      "Twilio",
      "SendGrid",
      "Claude Code",
      "Notion",
      "Microsoft Excel",
      "GitHub",
      "Vercel",
      "SQL",
      "Java",
      "Supabase",
      "VS Code",
      "Slack",
    ],
  },
];

// A single skill: brands with an official logo render as a colour badge; every
// other skill keeps the plain text chip.
function SkillItem({ name }: { name: string }) {
  const img = IMG_LOGOS[name];
  if (img) {
    return (
      <span className="logo-chip" title={img.title}>
        <img src={img.src} alt={name} />
      </span>
    );
  }
  const logo = BRAND_LOGOS[name];
  if (!logo) return <span>{name}</span>;
  return (
    <span className="logo-chip" title={logo.title}>
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        role="img"
        aria-label={name}
      >
        <path d={logo.path} fill={logo.hex} />
      </svg>
    </span>
  );
}

export function Skills() {
  return (
    <section className="block">
      <div className="par">
        {SKILLS.map((s) => (
          <div className="step" key={s.group}>
            <span className="k">{s.group}</span>
            <div className="meta">
              {s.items.map((i) => (
                <SkillItem key={i} name={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="block contact-block">
      <div className="contact-grid">
        <div>
          <h2 className="sec">Let&apos;s talk about your product.</h2>
          <p>
            I&apos;m looking for early-career product roles. If you&apos;re
            hiring, or you just want the raw evidence behind any piece here, the
            fastest way to reach me is email.
          </p>
        </div>
        <div>
          <ul className="channels">
            <li>
              <a href="mailto:jayanthadityaaa@gmail.com">
                <span className="lab">Email</span>
                <span className="val">jayanthadityaaa@gmail.com</span>
                <span className="arw">→</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jayanth-kappagantula/"
                target="_blank"
                rel="noopener"
              >
                <span className="lab">LinkedIn</span>
                <span className="val">
                  linkedin.com/in/jayanth-kappagantula
                </span>
                <span className="arw">↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/ThisisjayK"
                target="_blank"
                rel="noopener"
              >
                <span className="lab">GitHub</span>
                <span className="val">ThisisjayK</span>
                <span className="arw">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Resume() {
  return (
    <section className="block resume-block">
      <div className="block-head">
        <h2 className="sec">Résumé</h2>
        <p>
          The short version: my experience, the tools I reach for, and my
          education, all on a single page. Grab the PDF, or ask and I&apos;ll
          send a copy tailored to the role.
        </p>
      </div>
      <ul className="channels" style={{ maxWidth: "40ch" }}>
        {/* jayanth-resume.pdf lives in public/ (copied into docs/ on build);
            BASE_URL keeps the link correct under the /Portfolio/ Pages subpath. */}
        <li>
          <a
            href={`${import.meta.env.BASE_URL}jayanth-resume.pdf`}
            download="jayanth-resume.pdf"
          >
            <span className="lab">PDF</span>
            <span className="val">Download résumé</span>
            <span className="arw">↓</span>
          </a>
        </li>
        <li>
          <a href="mailto:jayanthadityaaa@gmail.com">
            <span className="lab">Email</span>
            <span className="val">Ask for a tailored copy</span>
            <span className="arw">→</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

export type VolunteerItem = {
  id: string;
  short: string;
  role: string;
  org: string;
  meta: string;
  url: string;
  image?: string;
  // Optional portrait artwork shown beside the copy on the detail page. Lives in
  // public/ (referenced through BASE_URL so it resolves under the /Portfolio/ base).
  photo?: string;
  photoAlt?: string;
  // Intrinsic pixel size of `photo`. Required whenever `photo` is set: the media
  // grid track is `auto` and the img is `width:auto`, so the column is sized by
  // the image. Without these the box has no aspect ratio to reserve space from
  // and collapses to its borders until the bytes arrive.
  photoW?: number;
  photoH?: number;
  did: string[];
};

export const VOLUNTEER_ITEMS: VolunteerItem[] = [
  {
    id: "fifa-world-cup-2026",
    short: "FIFA World Cup 2026",
    role: "Fan Operations Volunteer",
    org: "FIFA World Cup 2026, Boston Host City",
    meta: "Gillette Stadium, Foxborough · Jun–Jul 2026",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/boston-host-seven-matches-stadium",
    // Hover preview in the volunteer marquee and the detail-page artwork are the
    // same poster; the marquee crops it to a pill via background-size:cover.
    image: "bos.jpg",
    photo: "bos.jpg",
    photoW: 1100,
    photoH: 1414,
    photoAlt:
      "Official FIFA World Cup 26 Boston host-city poster: an illustrated Charles River scene with lobsters, swan boats and the Boston skyline.",
    did: [
      "Worked fan operations across all seven Boston matches, the biggest international soccer event in the world, with around 65,000 fans a match.",
      "Handed out FIFA Fan IDs to fans on each match day.",
      "Guided fans and answered wayfinding questions around the stadium.",
    ],
  },
  {
    id: "the-period-society",
    short: "The Period Society",
    role: "Graphic Designer",
    org: "The Period Society, Hyderabad, India",
    meta: "Youth-run menstrual-equity nonprofit",
    url: "https://www.instagram.com/periodsociety/",
    did: [
      "Designed social-media posts for a youth-run nonprofit working to end the stigma around menstruation.",
      "Supported campaigns widening access to menstrual-health and sex education.",
    ],
  },
  {
    id: "muskurahat-foundation",
    short: "Muskurahat Foundation",
    role: "Fundraiser",
    org: "Muskurahat Foundation, Mumbai, India",
    meta: "Education NGO for children in need",
    url: "https://www.muskurahat.org.in/",
    did: [
      "Raised roughly $1,000 over nine months for the foundation.",
      "Supported an NGO that provides free education to children in Mumbai's slums, orphanages, and shelter homes.",
    ],
  },
];

export function Volunteer({ onOpen }: { onOpen?: (id: string) => void } = {}) {
  return (
    <section className="block volunteer-block">
      <div className="vol-menu">
        <FlowingMenu
          items={VOLUNTEER_ITEMS.map((v) => ({
            link: `#volunteer/${v.id}`,
            text: v.short,
            marqueeText: v.role,
            image: v.image
              ? `${import.meta.env.BASE_URL}${v.image}`
              : undefined,
            onSelect: () => onOpen?.(v.id),
          }))}
          speed={18}
          bgColor="transparent"
          textColor="var(--ink)"
          marqueeBgColor="var(--ink)"
          marqueeTextColor="var(--paper)"
          borderColor="var(--ink-28)"
        />
      </div>
    </section>
  );
}

// A volunteering role opens as an in-site page (reusing the teardown/case-study
// chrome) explaining what Jay did, with a link out to the organisation.
export function VolunteerDetail({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const item = VOLUNTEER_ITEMS.find((v) => v.id === id);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  // Shared by both layouts: with a photo it sits in the right-hand column, without
  // one it stays the single centred column the other roles use.
  const copy = (
    <>
      <h1>{item.org}</h1>
      <p className="lede">{item.meta}</p>
      <ul className="vol-detail-list">
        {item.did.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <a
        className="inline"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit {item.short} ↗
      </a>
    </>
  );

  return (
    <motion.div
      className={`teardown-page vol-page${item.photo ? " vol-page--media" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.short} volunteering`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.22, 0.68, 0.24, 1] }}
    >
      <button
        className="teardown-close"
        type="button"
        onClick={onClose}
        aria-label="Close (Escape)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Esc</span>
      </button>

      <div className="teardown-page__inner">
        {item.photo ? (
          <div className="vol-split">
            <figure className="vol-split__media">
              {/* eager, not lazy: this is the artwork the route exists to show,
                  and it sizes its own grid column. Lazy could never bootstrap —
                  a zero-width box does not intersect the viewport, so the fetch
                  that would give it a width never fires. */}
              <img
                src={`${import.meta.env.BASE_URL}${item.photo}`}
                alt={item.photoAlt ?? ""}
                width={item.photoW}
                height={item.photoH}
                loading="eager"
                decoding="async"
              />
            </figure>
            <div className="vol-split__body">{copy}</div>
          </div>
        ) : (
          copy
        )}
      </div>
    </motion.div>
  );
}

// Hand-traced from the reference pixel-art wave: a 37x20 grid ('.' background,
// 'N' the navy body, 'L' the light-blue wake beneath and behind it), sampled
// cell-by-cell off the actual artwork rather than generated from a formula.
// Tiled left-to-right with its own background gap between repeats (the wave
// doesn't reach the tile's right or bottom edges), instead of stretched into
// a continuous band.
const WAVE_TILE_ROWS: string[] = [
  ".....................................",
  "......................NNNNL..........",
  ".....................NNNNNNNN.....NN.NNLLLNN.",
  "...................NNNNNNNNNNNNNNNNNNNLLNNLN.",
  ".................NNNNNNNNNNNNNNNNNNNLLNNLLL..",
  "...............NNNNNNNNNNNNNNNNNNNNNLLNNNNNLL...",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNLLNNNNLLNNNNNL...",
  "NNNNNNNNNNNNNNNNNNNNLLLNNNNNNNNNNNLNLNNNLLLLNN..",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNLLLLNNNLLLLLLNNN..",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNLLLLNNNNNLNL...",
  "LLLNNNNNNNNNNNNLLNNNNNNNNNNLLLNNNLNNNL.......",
  "LLLNNNNNNLLLLLLLLNNNNNNNLLLLLLNNLNLN.......",
  "LLLLLLLLLLLLLLLLNNNNLLLLLLLLLNLLL........",
  "LLLLLLLLLLLLLLLNNNNLLLLLLLLLLL.........",
  "LLLLLLLLLLLLLLLNNLLLLLLLLLL...........",
  "........LLLLLLLLLLLL.................",
  "..........LLLLLLLL...................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
];

const WAVE_WIDTH = 1200;
const WAVE_HEIGHT = 40;
const WAVE_CELL = 2;
const TILE_COLS = WAVE_TILE_ROWS[0].length;
const TILE_ROWS = WAVE_TILE_ROWS.length;
const TILE_WIDTH = TILE_COLS * WAVE_CELL;
const WAVE_REPEATS = Math.ceil(WAVE_WIDTH / TILE_WIDTH);

// Run-length encodes one colour's cells per row, per tile repeat, into
// closed rects - far fewer path commands than one rect per cell, while
// still landing on crisp cell boundaries.
function buildTilePath(cell: string) {
  let d = "";
  for (let rep = 0; rep < WAVE_REPEATS; rep++) {
    const originX = rep * TILE_WIDTH;
    for (let row = 0; row < TILE_ROWS; row++) {
      const line = WAVE_TILE_ROWS[row];
      const y = row * WAVE_CELL;
      let col = 0;
      while (col < TILE_COLS) {
        if (line[col] !== cell) {
          col++;
          continue;
        }
        const start = col;
        while (col < TILE_COLS && line[col] === cell) col++;
        const x = originX + start * WAVE_CELL;
        const w = (col - start) * WAVE_CELL;
        d += `M${x},${y} H${x + w} V${y + WAVE_CELL} H${x} Z `;
      }
    }
  }
  return d.trim();
}

// Below the waterline (half the strip, where the tile's own wake cells
// already cluster) a full-width band closes every gap between tiles, so the
// water reads as one continuous surface there. Above it, only the tile's
// own L cells draw - everywhere else stays bare page background, the sky
// the wave leaps out of, which stays deliberately unfilled.
const WATERLINE_ROW = 10;
const WATERLINE_Y = WATERLINE_ROW * WAVE_CELL;

const PIXEL_WAVE_NAVY = buildTilePath("N");
const PIXEL_WAVE_FOAM =
  buildTilePath("L") + ` M0,${WATERLINE_Y} H${WAVE_WIDTH} V${WAVE_HEIGHT} H0 Z`;

export function Footer() {
  return (
    <footer className="foot" aria-hidden="true">
      <div className="foot-wave-clip">
        <svg
          className="foot-wave"
          viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path
            className="foot-wave__navy"
            d={PIXEL_WAVE_FOAM}
            shapeRendering="crispEdges"
          />
          <path
            className="foot-wave__foam"
            d={PIXEL_WAVE_NAVY}
            shapeRendering="crispEdges"
          />
        </svg>
      </div>
      <div className="foot-shark-wrap">
        <img
          className="foot-shark"
          src={`${import.meta.env.BASE_URL}shark-fin.png`}
          alt=""
          aria-hidden="true"
        />
        <span className="foot-shark-ripple foot-shark-ripple--a" />
        <span className="foot-shark-ripple foot-shark-ripple--b" />
      </div>
    </footer>
  );
}
