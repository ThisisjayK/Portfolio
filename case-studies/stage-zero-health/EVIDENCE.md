# Evidence file

Every external claim made in the Stage Zero Health case study, with its source
and the date it was checked. Verified 27 July 2026.

Claims about my own work at Stage Zero are written from memory and are not
sourceable. They are marked as such below rather than quietly mixed in with the
cited material.

---

## Screening guidelines

**Claim:** The USPSTF recommends biennial screening mammography for women aged
40 through 74.

- [USPSTF final recommendation statement, Screening for Breast Cancer](https://www.uspreventiveservicestaskforce.org/uspstf/announcements/final-recommendation-statement-screening-breast-cancer-0)
- [JAMA, 2024;331(22):1918-1930](https://jamanetwork.com/journals/jama/fullarticle/2821998)
- [PubMed 38687503](https://pubmed.ncbi.nlm.nih.gov/38687503/)

Finalized 30 April 2024. This lowered the start age from 50, where the 2016
recommendation had it.

**Claim:** For women 75 and over, the USPSTF says the evidence is insufficient
to make a recommendation either way.

Same sources as above. This is a grade I statement, which means insufficient
evidence, not a recommendation against.

**Note on other bodies.** The American Cancer Society and the American College
of Radiology publish their own guidance and it differs from USPSTF. The case
study cites USPSTF specifically and says so.

**Correction made during drafting.** An earlier version of this case study
described the free-screening window as ages 35 to 70. That is not the USPSTF
range and it was removed. The verified figure is 40 to 74.

---

## The Gail model

**Claim:** The Gail model uses six factors, including the number of
first-degree relatives with breast cancer.

- [NCI Breast Cancer Risk Assessment Tool](https://bcrisktool.cancer.gov/calculator.html)

**Claim:** It excludes paternal family history, second-degree relatives, the age
relatives were diagnosed, and family history of ovarian cancer.

- [Assessing Breast Cancer Risk Estimates Based on the Gail Model and Its Predictors in Qatari Women, PMC5932695](https://pmc.ncbi.nlm.nih.gov/articles/PMC5932695/)
- [Next Top Model: An Overview of Breast Cancer Risk Assessment Models, Applied Radiology](https://appliedradiology.com/Articles/next-top-model-an-overview-of-breast-cancer-risk-assessment-models)

**Claim:** It has been shown to overestimate risk, and to perform unevenly
across populations.

- [Assessment of the clinical utility of the Gail model in an Indian population, ecancer](https://ecancer.org/en/journal/article/363-assessment-of-the-clinical-utility-of-the-gail-model-in-estimating-the-risk-of-breast-cancer-in-women-from-the-indian-population)
- [Assessing risk of breast cancer in an ethnically South-East Asian population, PMC3529190](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3529190/)

**Claim:** A first-degree relative with breast cancer roughly doubles risk.

- PMC5932695, above.

---

## BOADICEA

**Claim:** BOADICEA reads truncating variants in BRCA1, BRCA2, PALB2, CHEK2 and
ATM, a polygenic risk score based on 313 SNPs, a residual polygenic component,
lifestyle, hormonal and reproductive factors, and mammographic density.

- [Lee et al., BOADICEA: a comprehensive breast cancer risk prediction model incorporating genetic and nongenetic risk factors, Genetics in Medicine 2019](https://www.nature.com/articles/s41436-018-0406-9)
- [Correction, PMC7608223](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7608223/)

**Claim:** BOADICEA is a genetic susceptibility model, structurally different
from Gail's empirical summary of family history.

- [The BOADICEA model of genetic susceptibility to breast and ovarian cancer, British Journal of Cancer](https://www.nature.com/articles/6602175)

The 313-SNP polygenic score explains roughly 20% of breast cancer polygenic
variance, per Lee et al.

---

## Claims from memory, not sourceable

These come from my own work and I cannot cite them. Listed here so a reader can
separate them from the clinical material above.

- The product's journey structure: onboarding, assessment, risk score, insights
  and recommendations, SDOH assessment, care team, screening
- The four personas and their names
- The 45 to 60 question count across the full journey
- Gail collected across the first two to three milestones, BOADICEA behind a
  paywall after genetic data
- The ensemble re-firing design, its event-driven milestone triggers, and its
  intended extension to other cancer types
- Epic FHIR for medical history pre-fill, Change API for insurance verification
- The Gemini-powered LLM assistant: its scope, guardrails, and that I
  prototyped and validated it before handoff
- The 600+ user waitlist and 40+ beta tester counts
- Tooling: Jira then Asana, Miro, Figma, Twilio, SendGrid, Customer.io, GA4
- Two-week sprints, and bug triage run with engineering and beta testers
- Funding of $50K roughly one to two weeks after my internship ended, and $400K
  after that

## The pilot, reported at the time rather than sourced now

**Claim:** A six-week, 30-user paid pilot of the at-home screening product had
18 of 30 paying users still active through week six (60%), and weekly churn
fell from 10% to 5% over the same six weeks.

This is not externally sourceable — it is a number I tracked and reported out
myself during the internship, not a citation to someone else's publication. It
is marked separately from the rest of the "claims from memory" list above
because I am recalling a number I reported at the time, not reconstructing an
architecture from general recollection the way the rest of this list is. Small
n, pre-seed; not presented as a statistically powered result.

**Not claimed anywhere:** completion rates broken out by persona, conversion
rates beyond the pilot, screening bookings, high-risk identification rates, or
any causal link between my work and the funding.
