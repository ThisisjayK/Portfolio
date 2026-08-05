import { useEffect, useState } from "react";
import { AnimatedPage } from "../components/AnimatedPage";

/* The Stage Zero Health case study, rendered as a scrollable long-form page
   over the app. Deliberately reuses the .teardown-page / .td-* styling built
   for the Kick teardown so both long-form pieces read as one system; the only
   rule of its own is .td-more, the control that discloses the body.

   The page opens as a summary and reveals the rest on request, so a visitor can
   decide from ~150 words whether to spend ten minutes here.

   This file is the source of record for the copy. A CASE-STUDY.md used to hold
   the same prose alongside the citations, but nothing read it at build time, so
   the two drifted and only this one reached visitors. Prose edits belong here.
   Every external claim is still cited in
   case-studies/stage-zero-health/EVIDENCE.md. */

/* The seven milestones of the Breast Cancer Journey, in order. Kept as data
   because the diagram reads the count: the rail, the two model brackets and the
   integration wires all lay out on one seven-column grid, and the brackets are
   positioned by milestone number. Changing this list means revisiting the
   grid-column spans in longform.css, which is the one thing here that cannot be
   derived from the array. */
const MILESTONES: { n: string; label: string }[] = [
  { n: "01", label: "Onboarding" },
  { n: "02", label: "Assessment" },
  { n: "03", label: "Risk score" },
  { n: "04", label: "Insights" },
  { n: "05", label: "SDOH" },
  { n: "06", label: "Care team" },
  { n: "07", label: "Screening" },
];

export default function StageZeroHealth({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatedPage
      className="teardown-page"
      role="dialog"
      aria-modal="true"
      aria-label="Stage Zero Health case study"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.22, 0.68, 0.24, 1] }}
    >
      <button
        className="teardown-close"
        type="button"
        onClick={onClose}
        aria-label="Close case study (Escape)"
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
        {/* 01 TITLE */}
        {/* The third chip used to name the format ("problem, solution, impact"),
            which told a reader nothing they could not infer from the headings.
            It carries the impact claim instead: this is the highest thing on the
            page after the title, and the claim is what a visitor is deciding on. */}
        <div className="eyebrow">
          <b>· Case study</b> <b>· Stage Zero Health</b>{" "}
          <b>· Questionnaire to decision</b>
        </div>
        {/* The monkey hangs off the "e" of the second "the". Anchoring it to a
            span around that one letter (rather than to a fixed offset) keeps
            it on the letter when the heading rewraps at other widths. */}
        <h1>
          Screening the women th
          <span className="monkey-perch">
            e
            <span
              className="monkey monkey--hang"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}monkey-hang-sheet.png)`,
              }}
            />
          </span>{" "}
          guidelines miss
        </h1>
        <p className="lede">
          A 32-year-old whose mother had breast cancer at 45 is at elevated risk
          and will not be offered a mammogram. Screening guidelines in the US
          start at 40. The risk model most clinics run to decide who counts as
          an exception looks at six things and never once looks at a gene.
        </p>
        <p>
          I was the technical PM intern at Stage Zero Health, a pre-seed
          startup, for five months. I owned the product journey that tried to
          close that gap, from a cold signup through to a booked screening.
        </p>
        <p>
          I inherited a login and a questionnaire that collected data and
          returned nothing. What I built was a milestone-based journey running
          two staged risk models, one free and immediate, one paid and genetic,
          backed by two integrations (Epic FHIR and Change API) pointed at a
          funnel of 45 to 60 questions.
        </p>
        {/* The no-numbers admission used to sit here, which put the weakest fact
            on the page directly above the control a cold visitor decides on. It
            is made in full at the top of the Impact section instead, where it
            answers a question the reader is actually asking by then. */}
        <dl className="td-meta">
          <div>
            <dt>Company</dt>
            <dd>Stage Zero Health. Pre-seed, early cancer detection</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Technical product manager intern, 5 months</dd>
          </div>
          <div>
            <dt>Owned</dt>
            <dd>The Breast Cancer Journey, onboarding through screening</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>
              Founder, ML, engineering, one UX designer, product marketing
            </dd>
          </div>
          <div>
            <dt>Inherited</dt>
            <dd>
              A login and a questionnaire that collected data and returned
              nothing
            </dd>
          </div>
          <div>
            <dt>Shipped to</dt>
            <dd>A 600+ user waitlist and 40+ beta testers</dd>
          </div>
          <div className="td-meta__art" aria-hidden="true">
            <span className="td-meta__stamp">
              <b>Web first</b>
              Optimised for mobile browsers
            </span>
          </div>
        </dl>

        {/* The journey as a diagram rather than the four separate paragraphs of
            prose that used to be the only description of it, and deliberately
            above the disclosure: a visitor deciding whether to spend ten minutes
            here can see the shape of what was built in about the time it takes to
            read the lede. Which milestone each model fires at, and which step each
            integration lands on, is the whole architecture of the piece.
            Drawn from the spec from memory. The caption says so outright, because
            a diagram in a case study reads as if it were traced off a screenshot
            and there is no screenshot of this product to trace. */}
        {/* A bare h2, the same as "What I'd do differently" and "Sources &
            verification" lower down, rather than the bordered pill that marks
            Problem, Solution and Impact. Those three are the spine of the body;
            this sits above the disclosure and should read as a labelled figure,
            not as a fourth peer to them. */}
        <h2 className="td-flow-title">Journey</h2>
        <figure className="td-flow">
          <div className="td-flow__diagram">
            {/* The rail. An <ol> because these are seven ordered steps, and the
                arrows between them are drawn on the nodes rather than sitting in
                the markup, so nothing here is read out as punctuation. */}
            <ol className="td-flow__rail">
              {MILESTONES.map((m) => (
                <li className="td-flow__node" key={m.n}>
                  <b>{m.n}</b>
                  <span>{m.label}</span>
                </li>
              ))}
            </ol>

            {/* Each band is a bracket under the range its model fires across,
                with end ticks that land on the first and last node it covers.
                The range is still spelled out in the label: the bracket is the
                fast read, the words are what survives losing the geometry. */}
            <div className="td-flow__bands">
              <div className="td-flow__band td-flow__band--free">
                <span className="k">Milestones 01 to 03 · Gail · free</span>
                <p>
                  Everything Gail reads is collected off questions anyone can
                  answer, so a real score lands before the long tail of the
                  assessment rather than after it.
                </p>
              </div>
              <div className="td-flow__band td-flow__band--paid">
                <span className="k">
                  Milestones 04 to 07 · BOADICEA · behind the paywall
                </span>
                <p>
                  Fires once the genetic vault holds data. The ensemble re-runs
                  whichever models the user&apos;s data can support as more of
                  it arrives, so no score sits stale behind what she already
                  gave us.
                </p>
              </div>
            </div>

            {/* What runs underneath, drawn as wires tapped into the milestone
                they attach to rather than listed in a strip. Each one still
                names that milestone in its own sentence, so the marker is the
                shortcut and never the only way to know where it lands. */}
            <div className="td-flow__wires">
              <span className="td-flow__wires-k">Running underneath</span>
              <p className="td-flow__wire td-flow__wire--fhir">
                <b>Epic FHIR</b> pre-fills medical history at Assessment, so
                nothing already in the record gets asked twice
              </p>
              <p className="td-flow__wire td-flow__wire--change">
                <b>Change API</b> verifies coverage before Screening, so the
                bill is known before the booking rather than after it
              </p>
              <p className="td-flow__wire td-flow__wire--msg">
                <b>Email and SMS</b>, branched by persona, carry a user between
                every milestone
              </p>
              <p className="td-flow__wire td-flow__wire--learn">
                <b>Learning</b> sits outside the sequence entirely, open the
                whole way through and gated by no milestone, in language that
                does not need a clinician standing next to you to translate it
              </p>
            </div>
          </div>
          <figcaption>
            The Breast Cancer Journey as I specced it: seven milestones, two
            staged risk models, two integrations, and the two things that run
            the whole way through. Redrawn from memory. No screenshots of the
            product survive, and nothing here is reconstructed from one.
          </figcaption>
        </figure>

        <p>
          What follows is the three places a woman falls out of the system, the
          architectural decision I would defend hardest, and the one number I
          would have held myself to.
        </p>

        {/* Everything below the summary is disclosed on request: the page opens as
            a ~150 word summary so a cold visitor can decide whether to spend the
            next ten minutes here. Conditionally rendered rather than hidden with
            CSS so a collapsed study costs nothing to scroll past. */}
        <button
          className="td-more"
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Hide the full case study" : "Read the full case study"}
        </button>

        {expanded && (
          <AnimatedPage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 0.68, 0.24, 1] }}
          >
            {/* 02 PROBLEM */}
            <span className="td-finding">Problem</span>
            <h2 style={{ marginTop: ".2rem" }}>Three places she falls out</h2>
            <p>
              These are not three separate complaints. They are sequential, and
              they are the three points a woman drops out of the system: she is
              never offered screening in the first place, and if she does get
              assessed the model is blind, and if she is referred anyway she
              cannot find out what it costs until the bill arrives.
            </p>

            <h3>The guideline gap</h3>
            <p>
              The US Preventive Services Task Force recommends biennial
              mammography from <strong>40 through 74</strong>. That was updated
              in April 2024, moving the start age down from 50. Below 40 there
              is no routine screening recommendation for average risk, and for
              75 and over the Task Force says the evidence is not there either
              way.
            </p>
            <p>
              Insurance coverage tends to follow the guideline, which means the
              guideline is not only clinical advice.{" "}
              <strong>It is the thing that decides who pays.</strong>
            </p>
            <p>
              Family history is meant to be the route around this. A
              first-degree relative with breast cancer roughly doubles your
              risk, and that can qualify you for earlier or supplemental
              screening. Getting on that route requires someone to assess your
              risk and act on it. Most women under 40 have no idea the option
              exists, and there is no appointment on anyone&apos;s calendar
              where that conversation is scheduled to happen.
            </p>
            <p>
              This is the one of the three a product cannot close. Nothing I
              specced was going to move a USPSTF recommendation. It is the
              context the other two gaps sit inside, and the two I could
              actually attack are the ones below.
            </p>

            <h3>The model gap</h3>
            <p>
              When a clinic does assess risk, it usually runs the{" "}
              <strong>Gail model</strong>. Six factors: current age, age at
              first period, age at first live birth, number of first-degree
              relatives with breast cancer, previous biopsies, and race or
              ethnicity.
            </p>
            <p>Look at what that list does not contain.</p>
            <table className="td-table">
              <thead>
                <tr>
                  <th>Gail reads</th>
                  <th>Gail never sees</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current age</td>
                  <td>
                    <span className="bad">Paternal family history</span>
                  </td>
                </tr>
                <tr>
                  <td>Age at first period</td>
                  <td>
                    <span className="bad">Second-degree relatives</span>
                  </td>
                </tr>
                <tr>
                  <td>Age at first live birth</td>
                  <td>
                    <span className="bad">
                      The age relatives were diagnosed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>First-degree relatives with breast cancer</td>
                  <td>
                    <span className="bad">
                      Family history of ovarian cancer
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Previous biopsies</td>
                  <td>
                    <span className="bad">Any genetic result at all</span>
                  </td>
                </tr>
                <tr>
                  <td>Race or ethnicity</td>
                  <td>
                    <span className="bad">Mammographic density</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Gail is an empirical summary of family history rather than a
              genetic model, and it has been shown to overestimate risk in some
              populations and to perform unevenly across others.
            </p>
            <div className="td-callout warn">
              <div className="h">Why this one is the product problem</div>
              <p>
                The failure is quiet. Nobody is told &quot;this model did not
                look at your father&apos;s side.&quot; They are handed a number,
                and the number reads as an answer.
              </p>
            </div>

            <h3>The cost gap</h3>
            <p>
              Supplemental screening past a mammogram, MRI or ultrasound, is
              expensive. Whether insurance covers it depends on the plan and on
              how the referral is coded, and most people find out after the
              fact. Faced with an unknown bill, a lot of them simply do not
              book.
            </p>

            <h3>What the company needed to be able to say</h3>
            <p>
              Stage Zero was pre-seed. The thing the company needed to be able
              to say was a number:{" "}
              <strong>
                we identified X women at elevated risk, and Y of them got
                screened.
              </strong>{" "}
              Not &quot;users engaged with the assessment.&quot; If the journey
              could not carry someone from a cold signup to an appointment, the
              risk models were an interesting academic exercise and nothing
              else.
            </p>

            {/* 03 SOLUTION */}
            <span className="td-finding">Solution</span>
            <h2 style={{ marginTop: ".2rem" }}>
              What I owned, and the order I did it in
            </h2>
            <p>
              First week and a half: market research on breast cancer in Boston
              and New York, sized TAM, SAM and SOM, presented it to the founder.
              What existed at that point was a website with a login and a
              questionnaire. Data went in. Nothing came back out, and there was
              no reason for anyone to return.
            </p>

            <h3>Why I read the model before I designed on top of it</h3>
            <p>
              <strong>
                Once you know exactly what Gail counts, you know exactly what it
                misses, and that gap turned into the product.
              </strong>{" "}
              That is the whole reason the order of this section is the order I
              did the work in, and not a timeline I am reciting.
            </p>
            <p>
              So before designing anything I went and read the Gail model
              properly: how it was developed, its factor set, its weights, the
              score it produces, its published accuracy, and where it has been
              shown to break. Then I wrote the user stories for engineering to
              reproduce it, with the weights and expected output scores written
              into the ticket, so a build could be checked against known cases
              instead of eyeballed.
            </p>

            <h3>Four personas, from data that was already sitting there</h3>
            <p>
              Interviews and a survey had been run before I arrived and nobody
              had compiled them. I went through both, pulled the patterns that
              kept recurring, and landed on four personas: the skeptic, the
              optimizer, the avoidant, and the optimistic.
            </p>
            <p>
              The avoidant one is the reason the journey is shaped the way it
              is. That person&apos;s problem is not a lack of information. It is
              that finding out is frightening, so the journey needs somewhere
              for them to stop and something that brings them back.
            </p>

            {/* The seven milestones used to be listed here as well as in the
                diagram at the top of the page. Two copies of the same list is
                how the old CASE-STUDY.md and this file drifted apart, so the
                diagram owns the sequence now and this section keeps only what a
                diagram cannot say: why it is milestone-shaped, and how it got
                built. */}
            <h3>The journey</h3>
            <p>
              Milestone-based, so a user always knows what they have finished and
              what the next thing unlocks. The sequence is the diagram at the top
              of this page. I built it in Miro first, then specced it.
            </p>

            <span className="td-finding">
              The decision I&apos;d defend hardest
            </span>
            <h3 style={{ marginTop: ".2rem" }}>Two models, staged</h3>
            <table className="td-table">
              <thead>
                <tr>
                  <th />
                  <th>Gail, the basic score</th>
                  <th>BOADICEA, the advanced score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Fires at</th>
                  <td>Milestones 1 to 3</td>
                  <td>Once genetic data exists</td>
                </tr>
                <tr>
                  <th>Reads</th>
                  <td>6 personal and family factors</td>
                  <td>
                    BRCA1/2, PALB2, CHEK2 and ATM variants, a 313-SNP polygenic
                    score, family pedigree, lifestyle and hormonal factors,
                    mammographic density
                  </td>
                </tr>
                <tr>
                  <th>Costs the user</th>
                  <td>Nothing</td>
                  <td>Paid</td>
                </tr>
                <tr>
                  <th>Why it sits there</th>
                  <td>A real number early, off questions anyone can answer</td>
                  <td>
                    Accuracy, once there is enough data to be accurate with
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Everything Gail needs was collected in the first two or three
              milestones, so a user gets a real score early instead of grinding
              through an hour of questions on faith. BOADICEA sat behind a
              paywall, because it needs genetic data to say anything and it is
              the one that earns the word accurate. Feeding it meant a{" "}
              <strong>genetic vault</strong> to collect and store that data,
              which I specced after researching which genetic factors actually
              move breast cancer risk.
            </p>
            <p>
              The ensemble was the actual architecture. Whichever models the
              user&apos;s data could support would fire, and they would{" "}
              <strong>re-fire as more data arrived</strong>, so a score never
              sat stale behind information the user had already given us. I
              owned the API contracts, what data went into each model, and the{" "}
              <strong>event-driven</strong> milestone triggers that fired each
              one. The intent was to extend the same pattern past breast
              cancer to other cancer types.
            </p>
            <div className="td-callout">
              <div className="h">The part I am not comfortable with</div>
              <p>
                Putting the more accurate score behind a payment, in a health
                product, is a real tension and I do not think there is a clean
                answer to it. The version I would argue for is that the free
                score has to be a genuine score rather than a teaser, which is
                exactly why the Gail implementation had to be exact rather than
                approximate.
              </p>
            </div>

            {/* Four countermeasures, not two. The persona messaging and the
                gamified milestones used to sit in the scope list below, which
                split one argument across two sections and made it read weaker
                than it was: all four of these attack abandonment, and they
                belong under the enemy they were built to fight. */}
            <h3>The real enemy: 45 to 60 questions</h3>
            <p>
              Across the full journey a user answered somewhere between 45 and
              60 questions. That number is the thing most likely to kill the
              funnel, so most of the engineering I specced went at it directly,
              from four directions.
            </p>
            <ul>
              <li>
                <strong>Epic FHIR</strong> pulled existing medical history, so
                anything already in a user&apos;s record was skipped rather than
                asked again.
              </li>
              <li>
                <strong>Change API</strong> verified insurance coverage, so a
                user could see whether her screening was covered before booking
                rather than after.
              </li>
              <li>
                <strong>Personalised journeys and messaging</strong> per persona,
                over email and SMS, through Twilio, SendGrid and Customer.io.
                This is the one built for the avoidant persona, who does not need
                more information, she needs a reason to come back.
              </li>
              <li>
                <strong>Gamified milestones,</strong> because on a 60-question
                health journey the thing that loses people is not confusion, it
                is fatigue.
              </li>
            </ul>
            <p>
              Two integrations that size is a lot to take on at pre-seed. Neither
              was low-hanging fruit, and both were worth it, because all four of
              these attacked the same thing: this journey asks a great deal of
              someone before it gives them anything back, and every question you
              can answer on their behalf is a question they cannot abandon on.
            </p>

            <h3>A score nobody could read on their own</h3>
            <p>
              A risk score by itself is a number a patient has no way to act
              on. I defined the product requirements for a production-ready,{" "}
              <strong>Gemini-powered LLM assistant</strong> to sit next to it:
              the conversation flows, what it was and was not allowed to say,
              and the response guardrails around it. A health assistant needs
              a harder edge on that boundary than most chat products do. I
              then <strong>prototyped and validated</strong> the prompt
              behaviour against edge cases myself before handing it to
              engineering to build.
            </p>

            {/* This was seven bullets of equal weight, which formatted scope as
                though it carried the same argument as the architecture above it
                and flattened both. Two of the seven moved up to the abandonment
                section where they are load-bearing. The rest is scope, so it is
                set as scope: prose, and short. */}
            <h3>The rest of what I owned</h3>
            <p>
              The <strong>Insights tab</strong> is the one worth naming on its
              own: the risk score plus what to do about it, guideline-based
              recommendations and insurance context that I researched per risk
              tier. I designed and prototyped it and the prototype is what got
              built. Alongside it, the <strong>SDOH assessment</strong>, which I
              researched, prototyped and shipped, and a{" "}
              <strong>learning section</strong> covering breast cancer in
              language that does not need a clinician standing next to you to
              translate it.
            </p>
            <p>
              Then the things that are not features. Product positioning on the
              marketing site with the product marketing manager. The operating
              cadence: backlog, bug triage with engineering and beta testers,
              and two-week sprints in Jira and later Asana, GA4 for activation,
              DAU and MAU, and the minor UI fixes and redesigns I shipped
              myself throughout.
            </p>

            <h3>Where my ownership stopped</h3>
            <p>
              The founder and I made the product and UX calls together.
              Engineering built to my specs. The ML team owned the model
              internals. There was a UX designer on the team handling design,
              and I prototyped to spec what we wanted built. Product marketing
              owned the marketing site copy and I worked with them on
              positioning.
            </p>
            <p>
              Website-first was inherited rather than chosen. We optimised for
              mobile browsers rather than building an app, which I think was
              right for a pre-seed team but was not a decision I made.
            </p>

            {/* 04 IMPACT */}
            <span className="td-finding">Impact</span>
            <h2 style={{ marginTop: ".2rem" }}>
              What I can claim, and what I can&apos;t
            </h2>
            {/* The claim leads the section now. It used to sit below "what
                shipped" and above "what I would have instrumented", sandwiched
                between the two lists that are supposed to be substantiating it,
                which is the one place on the page it could not do its job. */}
            <div className="td-promise">
              <div className="lab">What actually changed</div>
              <q>
                A questionnaire that collected data became a journey that
                returns a decision.
              </q>
              <div className="verdict">Confirmed in a 30-user paid pilot</div>
            </div>
            <p>
              Before: a login and a questionnaire that collected data and
              returned nothing. After: a journey that produces a risk score,
              explains it, tells you what it means for your coverage, and routes
              you to a screening. That is the difference between data collection
              and a product, and it is the honest version of the impact claim.
            </p>
            <p>
              I also have one number I stand behind rather than a structural
              claim alone. Late in the internship we ran a{" "}
              <strong>six-week, 30-user paid pilot</strong> of the at-home
              screening product, and I tracked the funnel myself: activation,
              retention, churn. <strong>18 of the 30 paying users were still
              active through week six, 60%</strong>, and weekly churn fell
              from <strong>10% to 5%</strong> over the same six weeks. That is
              what I reported out, and it is what reprioritised the backlog
              going into the next sprint.
            </p>
            <p className="lede">
              What I do not have is the rest of the funnel. Pre-seed volume
              past that one pilot, I left before the cohort was large enough
              to say anything about screening bookings or high-risk
              identification with, and I have no access to what happened
              after. No completion rate broken out by persona, no conversion
              data beyond the pilot, and I have not estimated a single one of
              those to fill the gap.
            </p>
            <p>
              Rather than dress up something directional, here is what
              shipped, what the pilot measured, and what I would still have
              instrumented.
            </p>

            <h3>What shipped</h3>
            <ul>
              <li>
                A Gail implementation built against published weights, scoring
                users inside the first three milestones
              </li>
              <li>
                BOADICEA behind the advanced tier, reading from the genetic
                vault
              </li>
              <li>
                An ensemble that re-fires models as new data lands, so scores do
                not go stale
              </li>
              <li>Epic FHIR pre-fill and Change API coverage verification</li>
              <li>
                A milestone journey from onboarding through to screening,
                branching across four personas, shipped to a{" "}
                <strong>600+ user waitlist</strong> and{" "}
                <strong>40+ beta testers</strong>
              </li>
              <li>
                Insights, the SDOH assessment, the learning section, and the
                email and SMS messaging that carries someone between milestones
              </li>
              <li>
                A Gemini-powered LLM assistant that explains a user&apos;s
                score, prototyped and validated against edge cases before
                handoff
              </li>
            </ul>

            <h3>What the pilot measured</h3>
            <table className="td-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pilot size</td>
                  <td>30 paying users, over 6 weeks</td>
                </tr>
                <tr>
                  <td>Week-6 retention</td>
                  <td>18 users, 60%</td>
                </tr>
                <tr>
                  <td>Weekly churn</td>
                  <td>10% down to 5%</td>
                </tr>
              </tbody>
            </table>
            <p>
              Small n, and pre-seed, so I am not calling this statistically
              significant. What it gave the team was a real signal to
              reprioritise the backlog against instead of another round of
              guessing, which is the whole reason I ran it and reported it out
              in the first place.
            </p>

            <h3>What I would still have instrumented</h3>
            <table className="td-table">
              <thead>
                <tr>
                  <th>What I would measure</th>
                  <th>How I would know I was wrong</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Milestone completion rate, split by persona</td>
                  <td>
                    If the avoidant persona completes worst, the personalisation
                    is decorative
                  </td>
                </tr>
                <tr>
                  <td>
                    Questions saved per user by FHIR pre-fill, and the share of
                    assessments where it filled at least one section
                  </td>
                  <td>
                    If it saves almost nothing, a large integration is carrying
                    no weight
                  </td>
                </tr>
                <tr>
                  <td>Basic to advanced conversion</td>
                  <td>
                    Free-tier completion should not fall when the paywall
                    appears. If it does, the free score is reading as a teaser
                  </td>
                </tr>
                <tr>
                  <td>
                    High-risk identification rate, against clinical review
                  </td>
                  <td>
                    A model that flags everyone is useless. Precision matters
                    more than volume
                  </td>
                </tr>
                <tr>
                  <td>Screening bookings among identified high-risk users</td>
                  <td>The only number that actually matters</td>
                </tr>
                <tr>
                  <td>Coverage checks completed before booking</td>
                  <td>
                    Abandonment at the booking step should fall. If it does not,
                    cost was never the blocker
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="td-callout warn">
              <div className="h">
                Funding, stated as sequence and not as a result
              </div>
              <p>
                The company raised <strong>$50K</strong> about a week or two
                after I left, and <strong>$400K</strong> after that. I was not
                in those rooms and I cannot tell you what moved them.
              </p>
            </div>

            {/* 05 REFLECTION */}
            <h2>What I&apos;d do differently</h2>
            <h3>
              I built the journey before I could watch anyone move through it
            </h3>
            <p>
              GA4 and the activation metrics came later than they should have.
              On a 45 to 60 question journey, where people drop off is the
              single most valuable fact available, and I spent months not
              knowing it. If I ran this again the instrumentation would go in
              alongside the first milestone, not after the seventh.
            </p>
            <h3>The paywall placement is the thing I am least settled on</h3>
            <p>
              I can defend it. BOADICEA genuinely needs data the free tier does
              not collect, and someone has to pay for genetic processing. I
              still would not call it solved.
            </p>

            {/* The boundary between what's measured (the pilot) and what isn't
                (everything past it) is drawn once, at the top of Impact, rather
                than restated here. This list holds the limits that apply to the
                whole page, not a repeat of that one. */}
            <h3>Limits worth holding while reading this</h3>
            <ul>
              <li>
                <strong>Five months, pre-seed.</strong> Small team, decisions
                made fast and with incomplete information.
              </li>
              <li>
                <strong>Thirty users is a real signal, not a powered study.</strong>{" "}
                I am not claiming statistical significance on the pilot, only
                that it is what I measured and reported.
              </li>
              <li>
                <strong>Clinical guidance moves.</strong> The USPSTF
                recommendation cited here is the April 2024 version, current as
                of July 2026.
              </li>
            </ul>

            {/* 06 SOURCES */}
            <h2>Sources &amp; verification</h2>
            <ul>
              <li>
                Screening guidance:{" "}
                <a
                  className="inline"
                  href="https://www.uspreventiveservicestaskforce.org/uspstf/announcements/final-recommendation-statement-screening-breast-cancer-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  USPSTF final recommendation statement
                </a>
                , finalised 30 April 2024, and{" "}
                <a
                  className="inline"
                  href="https://jamanetwork.com/journals/jama/fullarticle/2821998"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JAMA 2024;331(22):1918-1930
                </a>
              </li>
              <li>
                The Gail model:{" "}
                <a
                  className="inline"
                  href="https://bcrisktool.cancer.gov/calculator.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NCI Breast Cancer Risk Assessment Tool
                </a>
                , and on its limits{" "}
                <a
                  className="inline"
                  href="https://appliedradiology.com/Articles/next-top-model-an-overview-of-breast-cancer-risk-assessment-models"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Applied Radiology
                </a>{" "}
                and{" "}
                <a
                  className="inline"
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5932695/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PMC5932695
                </a>
              </li>
              <li>
                BOADICEA:{" "}
                <a
                  className="inline"
                  href="https://www.nature.com/articles/s41436-018-0406-9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lee et al., Genetics in Medicine 2019
                </a>
                , and{" "}
                <a
                  className="inline"
                  href="https://www.nature.com/articles/6602175"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  the original BOADICEA model paper
                </a>
              </li>
            </ul>
            <p>
              Clinical claims verified 27 July 2026 against current guidance
              rather than against what was true during the internship, and the
              full claim-by-claim evidence file sits beside this page in the
              repository. Everything about my own work is written from memory.
              No affiliation with Epic, Change Healthcare, or any party named.
            </p>
          </AnimatedPage>
        )}

        <button className="teardown-back" type="button" onClick={onClose}>
          ← Back to case studies
        </button>
      </div>
    </AnimatedPage>
  );
}
