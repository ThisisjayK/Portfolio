# Screening the Women the Guidelines Miss

A product case study from five months as a technical product manager intern at
**Stage Zero Health**, a pre-seed early cancer detection company near MIT.

I owned the Breast Cancer Journey: onboarding through to a booked screening.

**Format:** Problem → Solution → Impact
**Read it in the site:** Case Studies tab → Stage Zero Health

---

## The short version

Standard breast cancer screening in the US starts at 40. The risk model most
clinics run to decide who counts as an exception is the Gail model, which looks
at six factors and never touches a gene, a paternal relative, or the age a
relative was diagnosed. A woman can be scored average and be nothing of the
sort.

The product had to do three things a clinic visit does not: assess risk with
models that see more than Gail does, tell the user what her score means for her
insurance before she books, and carry her from a cold signup all the way to an
appointment.

I specced the Gail implementation against the published weights, then designed
the staged model architecture that sits on top of it. Gail fires early, off
questions anyone can answer, so a user gets a real score in the first three
milestones. BOADICEA fires later, once genetic data exists, because it reads
BRCA1/2, PALB2, CHEK2, ATM and a 313-SNP polygenic score, and it is the one that
earns the word accurate. The ensemble re-fires as data arrives so a score never
sits stale behind information the user has already given.

## What's in this folder

| | |
|---|---|
| [`CASE-STUDY.md`](CASE-STUDY.md) | The full narrative, source of record for the in-site page |
| [`EVIDENCE.md`](EVIDENCE.md) | Every external claim in the piece, with its citation and verification date |
| [`assets/`](assets/) | Cover art for the case-studies gallery, one per theme ink |

The rendered page lives at [`src/StageZeroHealth.tsx`](../../src/StageZeroHealth.tsx)
and reuses the long-form page styling built for the Kick teardown.

## What I can't claim

No user numbers, no completion rates, no conversion data. Stage Zero was
pre-seed and I left before the cohort was large enough to say anything with. I
have no screenshots and no notes from the internship, so everything here is
written from memory: the architecture and the sequence of work are the parts I
am confident about, and I have not estimated a single metric to fill the gap.

The company raised $50K about a week or two after I left, and $400K after that.
That is sequence, not attribution. I was not in those rooms.

## Sources

Clinical claims in this case study are verified against current guidance rather
than what was true during the internship. Full citations in
[`EVIDENCE.md`](EVIDENCE.md).

- USPSTF breast cancer screening recommendation, April 2024
- Lee et al., *BOADICEA: a comprehensive breast cancer risk prediction model
  incorporating genetic and nongenetic risk factors*, Genetics in Medicine 2019
- NCI Breast Cancer Risk Assessment Tool (the Gail model calculator) and the
  published literature on its limitations

No affiliation with Epic, Change Healthcare, or any party named. Stage Zero
Health is a former employer and nothing here is confidential: the product
architecture described is my own work product, and the clinical claims are
public.
