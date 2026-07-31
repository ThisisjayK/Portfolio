/* Why each skill is on the list and where it was actually used.

   The rule that shapes this file: a skill only appears here if there is a real
   story behind it in something published on this site. Everything else stays a
   plain, unclickable chip. Twelve specific answers beat thirty-one padded ones,
   and a reader who opens three chips and gets three concrete stories trusts the
   list more than one who opens three and gets two shrugs. If you add a skill to
   SKILLS in sections/Skills.tsx and it has no entry here, it simply renders as
   a chip with nothing behind it, which is the correct default.

   `where` links into the long-form pages rather than restating them, so the
   panel is a route into the evidence instead of a dead end. An empty `where` is
   allowed for the one case where the evidence is the site itself. */

export type SkillTarget =
  | { kind: "case" }
  | { kind: "kick" }
  | { kind: "experience"; id: string };

export type SkillEvidence = {
  /** Full name, shown as the panel title. Logo chips render no text, so for
      those this is the only place a reader sees what the mark actually is. */
  name: string;
  why: string;
  where: SkillTarget[];
};

const CASE: SkillTarget = { kind: "case" };
const KICK: SkillTarget = { kind: "kick" };
const BA: SkillTarget = { kind: "experience", id: "bluevoir-business-analyst" };

export const SKILL_EVIDENCE: Record<string, SkillEvidence> = {
  "PRDs & specs": {
    name: "PRDs & specs",
    why: "Engineering at Stage Zero built to my specs. For the Gail risk model I wrote the published weights and the expected output scores into the ticket itself, so a build could be checked against known cases rather than eyeballed.",
    where: [CASE, BA],
  },
  "User stories": {
    name: "User stories",
    why: "At Bluevoir this was the whole job: gather requirements from product owners, then author the stories and functional specs the engineers worked from. At Stage Zero it was how the risk models reached the build.",
    where: [BA, CASE],
  },
  "Roadmap & backlog": {
    name: "Roadmap & backlog",
    why: "I ran the backlog for the Breast Cancer Journey across its seven milestones, in Jira and later Asana.",
    where: [CASE],
  },
  "Two-week sprints": {
    name: "Two-week sprints",
    why: "The cadence at Stage Zero, in Jira and then Asana. Planning at the front of each one, triage running through it.",
    where: [CASE],
  },
  "Bug triage": {
    name: "Bug triage",
    why: "Triage on a live product, where a broken milestone meant a user stopped partway through an assessment and had no particular reason to come back.",
    where: [CASE],
  },
  Prototyping: {
    name: "Prototyping",
    why: "I designed and prototyped the Insights tab and the SDOH assessment at Stage Zero and the prototypes are what got built. For the Kick teardown I prototyped all seven fixes rather than describing them.",
    where: [CASE, KICK],
  },
  "User interviews": {
    name: "User interviews",
    why: "The one I want to be exact about: I did not run these. The Stage Zero interviews existed before I arrived and what I did was compile them. The case study says plainly why shaping a journey around a persona built from someone else's follow-up questions is a hole in the work.",
    where: [CASE],
  },
  "Survey & interview synthesis": {
    name: "Survey & interview synthesis",
    why: "Interviews and a survey had been run at Stage Zero and nobody had compiled them. I went through both and pulled the patterns that kept recurring, which is where the personas came from.",
    where: [CASE],
  },
  Personas: {
    name: "Personas",
    why: "Four of them out of that synthesis: the skeptic, the optimizer, the avoidant and the optimistic. The avoidant one is the reason the journey has somewhere to stop and something that brings a user back.",
    where: [CASE],
  },
  "Journey mapping": {
    name: "Journey mapping",
    why: "The seven-milestone Breast Cancer Journey, mapped in Miro before any of it was specced.",
    where: [CASE],
  },
  "TAM / SAM / SOM": {
    name: "TAM / SAM / SOM",
    why: "First week and a half at Stage Zero: market research on breast cancer in Boston and New York, sized, and presented to the founder.",
    where: [CASE],
  },
  "Market research": {
    name: "Market research",
    why: "Breast cancer screening in Boston and New York, in my first fortnight at Stage Zero. Later, the guideline and insurance research per risk tier that the Insights tab was built on.",
    where: [CASE],
  },
  "Product teardowns": {
    name: "Product teardowns",
    why: "The Kick teardown: 82 minutes, 31 timestamped captures, four findings and seven fixes, with the counter-metric declared before any of the fixes.",
    where: [KICK],
  },
  GA4: {
    name: "Google Analytics 4",
    why: "Activation, DAU and MAU at Stage Zero. The honest version is in the case study: I put this in later than I should have, and on a 45 to 60 question journey, not knowing where people dropped off was the most expensive gap in the work.",
    where: [CASE],
  },
  Jira: {
    name: "Jira",
    why: "Backlog, triage and sprints at Stage Zero, before the team moved across to Asana.",
    where: [CASE],
  },
  Asana: {
    name: "Asana",
    why: "Where the Stage Zero backlog and sprint cadence ended up after Jira.",
    where: [CASE],
  },
  Miro: {
    name: "Miro",
    why: "Where the Breast Cancer Journey was drawn before it became a spec.",
    where: [CASE],
  },
  Figma: {
    name: "Figma",
    why: "Every fix in the Kick teardown was prototyped rather than described, so each one could be argued about as a screen instead of as a paragraph.",
    where: [KICK],
  },
  Twilio: {
    name: "Twilio",
    why: "The SMS side of the messaging that carries a Stage Zero user from one milestone to the next, branched by persona. Built for the avoidant one, who does not need more information so much as a reason to come back.",
    where: [CASE],
  },
  SendGrid: {
    name: "SendGrid",
    why: "The email side of that Stage Zero milestone messaging, branched by persona alongside the SMS.",
    where: [CASE],
  },
  "Claude Code": {
    name: "Claude Code",
    why: "This site. I wrote the copy and made the product calls, and paired with Claude Code on the build.",
    where: [],
  },
};
