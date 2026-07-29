// Official brand logos (in each company's own colour) for the Technical & tools
// skills. Only the tools with an available logo render as a badge; the rest
// fall back to a text chip.
import { BRAND_LOGOS } from "../data/brand-logos";
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
