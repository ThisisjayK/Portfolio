/* The two Bluevoir roles, as data rather than as two hand-built pages: they
   share a shape, so the detail page in src/sections/Experience.tsx renders both
   from here the same way VolunteerDetail renders src/data/volunteer.ts.

   These pages exist because the résumé was the only place this work appeared.
   Anyone reading the site saw the case study and eighteen months of nothing
   either side of it, which undersold the background rather than protecting it.
   Every role on the résumé now has an entry here, Stage Zero included, so the
   Experience tab and the résumé list the same career.

   HOUSE RULE: `did` is what Jay can describe first-hand and defend in an
   interview. `reported` is a figure someone else produced about that work. Both
   are real, and they are kept in separate fields because they answer to
   different questions, so do not promote a `reported` figure into `did` just
   because it is the more impressive line.

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
  /* Outcomes the project reported for this work. Rendered in their own block
     under "What the work moved", or omitted entirely when a role has none,
     which is its own kind of signal. */
  reported?: { figure: string; of: string }[];
  /** Read as "limits worth holding while reading this", same as the case study. */
  limits: string[];
  /* Set on the one role that also has a long-form write-up. The detail page
     renders a link into it, which is what keeps this entry short: the role page
     is the shape of the job, the case study is the argument, and nothing here
     should try to be both. That is the split the old CASE-STUDY.md lost. */
  caseStudy?: boolean;
};

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "stage-zero-health",
    short: "Technical PM Intern",
    role: "Technical Product Manager Intern",
    org: "Stage Zero Health",
    meta: "Stage Zero Health, Cambridge, MA · Aug to Dec 2025",
    eyebrow: ["· Experience", "· Stage Zero Health", "· Breast Cancer Journey"],
    title: "From a cold signup to a booked screening",
    lede:
      "Five months as the technical PM at a pre-seed cancer-detection startup, owning the Breast Cancer Journey end to end. This page is the shape of the role. The case study is the argument behind it, and it is the better read of the two.",
    facts: [
      {
        k: "Company",
        v: "Stage Zero Health. Pre-seed, early cancer detection, MIT incubator",
      },
      { k: "Role", v: "Technical product manager intern, 5 months" },
      {
        k: "Product",
        v: "The Breast Cancer Journey, onboarding through screening",
      },
      {
        k: "Owned",
        v: "Roadmap, specs, API contracts, personas, the pilot funnel",
      },
      {
        k: "Worked with",
        v: "Founder, ML, engineering, one UX designer, product marketing",
      },
      { k: "Shipped to", v: "A 600+ user waitlist and 40+ beta testers" },
    ],
    did: [
      "Inherited a login and a questionnaire that collected data and returned nothing. Owned the roadmap from concept to release and shipped a milestone journey that produces a risk score, explains it, and routes a user to a screening.",
      "Authored the technical specification for a staged risk-model ensemble, Gail on the free tier and BOADICEA behind the paid genetic tier, and defined the API contracts and event-driven milestone triggers with engineering.",
      "Defined the product requirements for a Gemini-powered LLM assistant that explains a score: conversation flows, knowledge boundaries, response guardrails. I prototyped and validated the prompt behaviour against edge cases before handing it over.",
      "Attacked a 45 to 60 question intake funnel from four directions: Epic FHIR pre-fill, Change Healthcare coverage checks, four personas built out of research nobody had compiled, and persona-branched email and SMS through Twilio, SendGrid and Customer.io.",
      "Ran two-week sprints and bug triage in Jira and later Asana, tracked activation, DAU and MAU in GA4, and reported out on a six-week, 30-user paid pilot: 18 of the 30 paying users still active through week six, 60%, and weekly churn down from 10% to 5%. That is the one number here I measured myself.",
    ],
    limits: [
      "Five months, pre-seed. Small team, decisions made fast and with incomplete information, and I was the intern in the room rather than the person who decided what the company was for.",
      "One measured number, off thirty users. Past that pilot I have no completion rates, no conversion data and no screening bookings, and I have not estimated a single one to fill the gap.",
      "No screenshots of the product survive. The architecture and the order I did the work in are what I am confident about, and the case study is where both are set out in full.",
    ],
    caseStudy: true,
  },
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
    // No `reported` block on purpose: nobody measured this role. Rather than
    // estimate a figure so it matches the architect page, this page says
    // outright that there isn't one. See the limits below.
    limits: [
      "There is no number on this page because nobody produced one. Better requirements and fewer manual HR steps are both real effects of this work, and I can size neither, so I have not tried to.",
      "Six months in my first role, working to a spec process that already existed. I learned it rather than designed it.",
      // TODO (Jay): worth adding one concrete requirement you got wrong and
      // had to rewrite. On a page about learning to write requirements, the
      // specific miss is more convincing than the summary, and it matches how
      // the Stage Zero page handles what it would do differently.
    ],
  },
];
