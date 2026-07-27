# Screening the Women the Guidelines Miss

**Stage Zero Health · Technical product manager intern · 5 months**
Problem → Solution → Impact

---

A 32-year-old whose mother had breast cancer at 45 is at elevated risk and will
not be offered a mammogram. Screening guidelines in the US start at 40. The risk
model most clinics run to decide who counts as an exception looks at six things
and never once looks at a gene.

I owned the product journey that tried to close that gap, from a cold signup
through to a booked screening.

| | |
|---|---|
| **Company** | Stage Zero Health, pre-seed, early cancer detection |
| **Role** | Technical product manager intern, 5 months |
| **Owned** | The Breast Cancer Journey, onboarding through screening |
| **Team** | Founder, ML team, engineering, one UX designer, product marketing |
| **Surface** | Web, optimized for mobile browsers |
| **Inherited** | A login page and a questionnaire that collected data and returned nothing |

---

## Problem

### Three gaps, stacked on each other

**The guideline gap.** The US Preventive Services Task Force recommends biennial
mammography from 40 through 74. That was updated in April 2024, moving the start
age down from 50. Below 40 there is no routine screening recommendation for
average risk, and for 75 and over the Task Force says the evidence is not there
either way. Insurance coverage tends to follow the guideline, which means the
guideline is not only clinical advice. It is the thing that decides who pays.

Family history is meant to be the route around this. A first-degree relative
with breast cancer roughly doubles your risk, and that can qualify you for
earlier or supplemental screening. Getting on that route requires someone to
assess your risk and act on it. Most women under 40 have no idea the option
exists, and there is no appointment on anyone's calendar where that conversation
is scheduled to happen.

**The model gap.** When a clinic does assess risk, it usually runs the Gail
model. Six factors: current age, age at first period, age at first live birth,
number of first-degree relatives with breast cancer, previous biopsies, and
race or ethnicity.

Look at what that list does not contain. Paternal family history. The age
relatives were diagnosed. Ovarian cancer in the family. Any genetic result at
all. Gail is an empirical summary of family history rather than a genetic model,
and it has been shown to overestimate risk in some populations and to perform
unevenly across others.

The failure is quiet, which is what makes it a product problem. Nobody is told
"this model did not look at your father's side." They are handed a number, and
the number reads as an answer.

**The cost gap.** Supplemental screening past a mammogram, MRI or ultrasound,
is expensive. Whether insurance covers it depends on the plan and on how the
referral is coded, and most people find out after the fact. Faced with an
unknown bill, a lot of them simply do not book.

### The business problem underneath

Stage Zero was pre-seed. The thing the company needed to be able to say was a
number: we identified X women at elevated risk, and Y of them got screened. Not
"users engaged with the assessment." If the journey could not carry someone from
a cold signup to an appointment, the risk models were an interesting academic
exercise and nothing else.

---

## Solution

### Where I started

First week and a half: market research on breast cancer in Boston and New York,
sized TAM, SAM and SOM, presented it to the founder. What existed at that point
was a website with a login and a questionnaire. Data went in. Nothing came back
out, and there was no reason for anyone to return.

### Rebuilding Gail from the paper up

Before designing anything I went and read the Gail model properly: how it was
developed, its factor set, its weights, the score it produces, its published
accuracy, and where it has been shown to break. Then I wrote the user stories
for engineering to reproduce it, with the weights and the expected output scores
written into the ticket, so a build could be checked against known cases instead
of eyeballed.

Doing that first mattered more than it looked like it would. Once you know
exactly what Gail counts, you know exactly what it misses, and that gap turned
into the product.

### Four personas, from data that was already sitting there

Interviews and a survey had been run before I arrived and nobody had compiled
them. I went through both, pulled the patterns that kept recurring, and landed
on four personas: the skeptic, the optimizer, the avoidant, and the optimistic.

The avoidant one is the reason the journey is shaped the way it is. That
person's problem is not a lack of information. It is that finding out is
frightening, so the journey needs somewhere for them to stop and something that
brings them back.

### The journey

Onboarding, assessment, risk score, insights and recommendations, SDOH
assessment, care team, screening. Milestone-based, so a user always knows what
they have finished and what the next thing unlocks. I built it in Miro first,
then specced it.

### The decision I would defend hardest: two models, staged

|  | Gail, the basic score | BOADICEA, the advanced score |
|---|---|---|
| Fires at | milestones 1 to 3 | once genetic data exists |
| Reads | 6 personal and family factors | BRCA1/2, PALB2, CHEK2 and ATM variants, a 313-SNP polygenic score, family pedigree, lifestyle and hormonal factors, mammographic density |
| Costs the user | nothing | paid |
| Why it sits there | a real number early, off questions anyone can answer | accuracy, once there is enough data to be accurate with |

Everything Gail needs was collected in the first two or three milestones, so a
user gets a real score early instead of grinding through an hour of questions on
faith. BOADICEA sat behind a paywall, because it needs genetic data to say
anything and it is the one that earns the word accurate.

The ensemble was the actual architecture. Whichever models the user's data could
support would fire, and they would re-fire as more data arrived, so a score
never sat stale behind information the user had already given us. I owned the
API contracts, what data went into each model, and which milestones triggered
which. The intent was to extend the same pattern past breast cancer to other
cancer types.

The uncomfortable part: putting the more accurate score behind a payment, in a
health product, is a real tension and I do not think there is a clean answer to
it. The version I would argue for is that the free score has to be a genuine
score rather than a teaser, which is exactly why the Gail implementation had to
be exact rather than approximate.

### 45 to 60 questions is the real enemy

Across the full journey a user answered somewhere between 45 and 60 questions.
That number is the thing most likely to kill the funnel, so most of the
engineering I specced went at it directly.

- **Epic FHIR** pulled existing medical history, so anything already in a user's
  record was skipped rather than asked again.
- **A genetic vault** collected and stored genetic data for BOADICEA, after I
  researched which genetic factors actually move breast cancer risk.
- **Change API** verified insurance coverage, so a user could see whether her
  screening was covered before booking rather than after.

Two integrations that size is a lot to take on at pre-seed. Both were worth it,
because both attacked the same thing: this journey asks a great deal of someone
before it gives them anything back, and every question you can answer on their
behalf is a question they cannot abandon on.

### The rest of what I owned

- **Insights tab.** The risk score plus what to do about it: guideline-based
  recommendations and insurance context, which I researched per risk tier. I
  designed and prototyped it, and the prototype is what got built.
- **SDOH assessment.** Researched it, prototyped the questionnaire, shipped it.
- **A learning section** covering breast cancer in language that does not need a
  clinician standing next to you to translate it.
- **Personalized journeys and messaging** per persona, over email and SMS,
  through Twilio, SendGrid and Customer.io.
- **Gamified milestones**, because on a 60-question health journey the thing
  that loses people is not confusion, it is fatigue.
- **Product positioning** on the marketing site, with the product marketing
  manager.
- **The operating cadence.** Backlog, triage and two-week sprints in Jira and
  later Asana. GA4 for activation, DAU and MAU. Minor UI fixes and redesigns I
  shipped myself throughout.

### Where my ownership stopped

The founder and I made the product and UX calls together. Engineering built to
my specs. The ML team owned the model internals. There was a UX designer on the
team handling design, and I prototyped to spec what we wanted built. Product
marketing owned the marketing site copy and I worked with them on positioning.

Website-first was inherited rather than chosen. We optimized for mobile browsers
rather than building an app, which I think was right for a pre-seed team but was
not a decision I made.

---

## Impact

### What I can claim, and what I can't

I do not have the numbers. Pre-seed volume, and I left before the cohort was
large enough to say anything meaningful with, and I have no access to what
happened after. Rather than dress up something directional, here is what shipped
and what I would have instrumented.

**What shipped**

- A Gail implementation built against published weights, scoring users inside
  the first three milestones
- BOADICEA behind the advanced tier, reading from the genetic vault
- An ensemble that re-fires models as new data lands, so scores do not go stale
- Epic FHIR pre-fill and Change API coverage verification
- A milestone journey from onboarding through to screening, branching across
  four personas
- Insights, the SDOH assessment, the learning section, and the email and SMS
  messaging that carries someone between milestones

**What changed structurally.** Before: a login and a questionnaire that
collected data and returned nothing. After: a journey that produces a risk
score, explains it, tells you what it means for your coverage, and routes you to
a screening. That is the difference between data collection and a product, and
it is the honest version of the impact claim.

### What I would have instrumented

| What I would measure | How I would know I was wrong |
|---|---|
| Milestone completion rate, split by persona | If the avoidant persona completes worst, the personalization is decorative |
| Questions saved per user by FHIR pre-fill, and share of assessments where it filled at least one section | If it saves almost nothing, a large integration is carrying no weight |
| Basic to advanced conversion | Free-tier completion should not fall when the paywall appears. If it does, the free score is reading as a teaser |
| High-risk identification rate, against clinical review | A model that flags everyone is useless. Precision matters more than volume here |
| Screening bookings among identified high-risk users | The only number that actually matters |
| Coverage checks completed before booking | Abandonment at the booking step should fall. If it does not, cost was never the blocker |

### Funding, stated as sequence

The company raised $50K about a week or two after I left, and $400K after that.
I am putting it here as context rather than as a result. I was not in those
rooms and I cannot tell you what moved them.

---

## Reflection

**I built the journey before I could watch anyone move through it.** GA4 and the
activation metrics came later than they should have. On a 45 to 60 question
journey, where people drop off is the single most valuable fact available, and I
spent months not knowing it. If I ran this again the instrumentation would go in
alongside the first milestone, not after the seventh.

**The paywall placement is the thing I am least settled on.** I can defend it.
BOADICEA genuinely needs data the free tier does not collect, and someone has to
pay for genetic processing. I still would not call it solved.

**Personas built from someone else's interviews are exactly that.** I compiled
the data carefully and the patterns were real. I never sat in front of a user
myself and asked the follow-up question I would have wanted to ask, and for the
avoidant persona in particular, the one whose behavior the whole journey is
shaped around, that is a real hole.

**Limits worth holding while reading this**

- Five months, pre-seed, small team, decisions made fast and with incomplete
  information.
- No user numbers, no completion rates, no conversion data. I do not have them
  and I have not estimated them.
- No screenshots and no notes. This is written from memory. The architecture and
  the order of the work are what I am confident about.
- Clinical guidance moves. The USPSTF recommendation cited here is the April
  2024 version, current as of July 2026.
