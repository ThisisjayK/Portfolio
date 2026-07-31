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

/* The opening used to lead with the category ("an early-career product
   manager who...") which is the one thing about Jay that is not distinctive.
   What is distinctive is that he will not claim impact he cannot source, so the
   lede leads with that and sends the reader at the case study section which
   proves it. The résumé facts follow immediately in the second paragraph, since
   a hiring manager still needs them inside the first few seconds. */
export function About({ onOpenCase }: { onOpenCase?: () => void } = {}) {
  return (
    <section className="hero">
      <h1 className="about-name">Hey, I&apos;m Jayanth</h1>
      <div className="cols">
        <div>
          <p className="lede">
            I keep what I did and what I can prove in separate columns. The case
            study on this site has a section listing the numbers I do not have,
            and that is the part I would rather you read first.
          </p>
          {/* Directly under the lede rather than at the end of the column: the
              lede tells the reader where to go, so the way there should be the
              next thing they see, not four paragraphs later. It also keeps the
              link clear of the footer band, which the bottom of this column
              runs into at the default reader size. */}
          {onOpenCase && (
            <p className="about-cta">
              <button className="about-link" type="button" onClick={onOpenCase}>
                Read the Stage Zero Health case study →
              </button>
            </p>
          )}
          <p>
            Five months as the technical PM intern at Stage Zero Health, a
            pre-seed startup in the MIT Incubator program, where I owned a breast
            cancer screening journey from a cold signup to a booked appointment.
            Before that, a year at Bluevoir Technologies, as a business analyst
            and then a Pega system architect.
          </p>
          <p>
            What I like most is reading whatever a product sits on top of.
            Learning exactly what the Gail risk score counts is how I found the
            things it never looks at, and that gap turned into the roadmap.
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
