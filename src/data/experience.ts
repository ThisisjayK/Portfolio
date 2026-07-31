/* The two Bluevoir roles, as data rather than as two hand-built pages: they
   share a shape, so the detail page in src/sections/Experience.tsx renders both
   from here the same way VolunteerDetail renders src/data/volunteer.ts.

   These pages exist because the résumé was the only place this work appeared.
   Anyone reading the site saw a five-month internship and eighteen months of
   nothing, which undersold the background rather than protecting it.

   HOUSE RULE, and it matters more here than anywhere else on the site: the
   Stage Zero case study refuses to estimate a number it cannot source, and that
   refusal is the most valuable thing in this portfolio. So the two percentages
   the résumé carries are NOT presented as results. They live in `reported`,
   which the page renders under a heading saying who measured them, which is not
   Jay. Do not promote them into `did`.

   TODO (Jay): the bullets below are written from the résumé lines and nothing
   else, because that is all that was available. Each role has notes marked
   TODO where the detail only you have would make the page land harder. */

export type ExperienceItem = {
  id: string;
  /** Marquee label in the Experience list. */
  short: string;
  role: string;
  org: string;
  /** Location and dates, shown under the page title. */
  meta: string;
  /** The "· Experience · Bluevoir ·" strip above the title. */
  eyebrow: string[];
  title: string;
  lede: string;
  facts: { k: string; v: string }[];
  did: string[];
  /* Figures the team reported, with no baseline or method Jay can produce.
     Rendered under an explicit "not measured by me" heading, or omitted
     entirely when a role has none, which is its own kind of signal. */
  reported?: { figure: string; of: string }[];
  /** Read as "limits worth holding while reading this", same as the case study. */
  limits: string[];
};

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "bluevoir-system-architect",
    short: "Pega System Architect",
    role: "Pega System Architect",
    org: "Bluevoir Technologies",
    meta: "Bluevoir Technologies, Hyderabad, India · Jan to Jun 2024",
    eyebrow: ["· Experience", "· Bluevoir Technologies", "· Case management"],
    title: "Where a threat report goes next",
    lede:
      "I architected the case-management workflows for a Microbial Threat Detection application at Bluevoir, built on Pega GenAI Blueprint. The part I owned was the routing: what state a case sits in, and which rule moves it to the next one.",
    facts: [
      { k: "Company", v: "Bluevoir Technologies. Pega implementation work" },
      { k: "Role", v: "Pega System Architect, 6 months" },
      { k: "Product", v: "Microbial Threat Detection (MTD) application" },
      { k: "Built on", v: "Pega GenAI Blueprint" },
      {
        k: "Owned",
        v: "Case-management workflow design, business rules, decision tables",
      },
      {
        k: "Worked with",
        v: "Public-health stakeholders, on investigation and MTAS case workflows",
      },
    ],
    did: [
      "Architected the case-management workflows for the MTD application, so a threat report stayed one tracked case from intake through to reporting instead of a chain of handoffs.",
      "Configured the business rules as decision tables rather than as logic buried inside the flow. Criteria on a public-health application move, and that choice is what let them move without a rebuild each time.",
      "Managed the investigation and MTAS case workflows with public-health stakeholders. That is where the states a case can be in came from, and the reason a WHO-reportable finding has a defined route to it rather than an ad hoc one.",
      "Worked inside Pega GenAI Blueprint, which is the reason the design-time figure below exists at all: the tool generates a first-pass application structure, and the work was in correcting and specifying against it rather than drawing every flow from scratch.",
    ],
    reported: [
      { figure: "30%", of: "reduction in design time" },
      { figure: "25%", of: "reduction in processing time" },
    ],
    limits: [
      "Six months, and as a system architect rather than as the product owner. I designed workflows against requirements. I did not decide what the application should do.",
      "This was client work and I have no screenshots of it. What I am confident about is the workflow architecture and the decision-table approach.",
      // TODO (Jay): add what MTAS stands for and one line on what the workflow
      // actually did, if you are able to say. Reads as an unexplained acronym
      // to anyone outside the project, which is most people.
      // TODO (Jay): if you know the baseline the 30% was measured against
      // (design time for a comparable Pega build without Blueprint?), say so
      // in `reported` below. A sourced number beats a labelled one.
    ],
  },
  {
    id: "bluevoir-business-analyst",
    short: "Business Analyst",
    role: "Business Analyst",
    org: "Bluevoir Technologies",
    meta: "Bluevoir Technologies, Hyderabad, India · Jan to Jun 2023",
    eyebrow: ["· Experience", "· Bluevoir Technologies", "· Requirements"],
    title: "Learning to write a requirement someone can build",
    lede:
      "My first professional role, on an HRMS covering employee hiring, onboarding and leave management. The job was to sit between product owners who knew what they wanted and engineers who needed it stated precisely enough to build, which is the same job I do now under a different title.",
    facts: [
      { k: "Company", v: "Bluevoir Technologies. Pega implementation work" },
      { k: "Role", v: "Business Analyst, 6 months" },
      {
        k: "Product",
        v: "HRMS. Employee hiring, onboarding, leave management",
      },
      { k: "Owned", v: "Requirements, user stories, functional specs" },
      { k: "Built on", v: "Pega BPM" },
    ],
    did: [
      "Gathered and refined specifications with product owners across hiring, onboarding and leave management, then authored the user stories and functional specs engineering built from.",
      "Translated those requirements into Pega BPM configurations and deployed end-to-end process-automation workflows alongside the project teams, which meant the spec and the thing that shipped were checked against each other by the same person.",
      "Replaced manual HR steps with automated ones. A BPM engagement lives or dies on that, and a badly written requirement is the usual reason a step stays manual.",
    ],
    // No `reported` block on purpose. The résumé says requirement accuracy
    // improved and manual effort fell; neither is sized, and rather than
    // estimate one the page says so out loud. See the limits below.
    limits: [
      "The résumé line for this role says requirement accuracy improved and manual HR effort fell. I cannot size either of those and I have not tried to. There is no number on this page because I do not have one.",
      "Six months in my first role, working to a spec process that already existed. I learned it rather than designed it.",
      // TODO (Jay): worth adding one concrete requirement you got wrong and
      // had to rewrite. On a page about learning to write requirements, the
      // specific miss is more convincing than the summary, and it matches how
      // the Stage Zero page handles what it would do differently.
    ],
  },
];
