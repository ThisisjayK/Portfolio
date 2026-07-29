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
