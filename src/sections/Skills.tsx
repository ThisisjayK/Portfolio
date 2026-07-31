// Official brand logos (in each company's own colour) for the Technical & tools
// skills. Only the tools with an available logo render as a badge; the rest
// fall back to a text chip.
import { BRAND_LOGOS } from "../data/brand-logos";
import { SKILL_EVIDENCE } from "../data/skill-evidence";
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

/* A single skill. The visual is unchanged (logo badge where there is a logo,
   text chip otherwise); what changes is the element. A skill with an entry in
   SKILL_EVIDENCE renders as a real button that opens its panel, and carries a
   marker so a reader can see which chips are worth pressing. Everything else
   stays an inert span, because a control that does nothing is worse than no
   control.

   Note the deliberate omission: logo chips still show no text label. Putting
   the name beside all seventeen marks would push this section past the fixed
   viewport it is designed to fit inside, and the panel itself opens with the
   full name as its title, so the name is one press away rather than absent.
   Both chip types carry the name in `title` and on the accessible label. */
function SkillItem({
  name,
  onOpen,
}: {
  name: string;
  onOpen?: (name: string) => void;
}) {
  const evidence = SKILL_EVIDENCE[name];
  const img = IMG_LOGOS[name];
  const logo = BRAND_LOGOS[name];
  const label = evidence?.name ?? img?.title ?? logo?.title ?? name;

  const inner = img ? (
    <img src={img.src} alt="" />
  ) : logo ? (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d={logo.path} fill={logo.hex} />
    </svg>
  ) : (
    name
  );

  const isLogo = Boolean(img || logo);
  const cls = isLogo ? "logo-chip" : "text-chip";

  if (!evidence) {
    return (
      <span className={cls} title={isLogo ? label : undefined}>
        {inner}
      </span>
    );
  }

  return (
    <button
      className={`${cls} chip-evidence`}
      type="button"
      title={`${label}. Why and where I used it`}
      aria-label={`${label}. Why and where I used it`}
      onClick={() => onOpen?.(name)}
    >
      {inner}
    </button>
  );
}

export function Skills({ onOpen }: { onOpen?: (name: string) => void } = {}) {
  return (
    <section className="block skills-block">
      <p className="skills-hint">
        The marked ones open: why I reached for it, and the write-up it was used
        on. The unmarked ones I have used, but there is nothing published here
        to point you at, so I have not pretended otherwise.
      </p>
      <div className="par">
        {SKILLS.map((s) => (
          <div className="step" key={s.group}>
            <span className="k">{s.group}</span>
            <div className="meta">
              {s.items.map((i) => (
                <SkillItem key={i} name={i} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
