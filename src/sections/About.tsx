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
      <p className="about-location"> from Boston, MA, USA</p>
      <div className="cols">
        <div>
          <p>
            Five months as the technical PM intern at Stage Zero Health, a
            pre-seed startup in the MIT Incubator program, where I owned a
            breast cancer screening journey from a cold signup to a booked
            appointment. Before that, a year at Bluevoir Technologies in
            Hyderabad, India, as a business analyst and then a Pega system
            architect.
          </p>
          <p>
            What I like most is reading whatever a product sits on top of.
            Learning exactly what the Gail risk score counts is how I found the
            things it never looks at, and that gap turned into the roadmap. That
            same reading is what told me where to stop: Gail needs nothing past
            the first two or three milestones, so a real score could ship there
            rather than at the end of the questionnaire.
          </p>
          {/* Sits directly under the paragraph it proves: the claim above is
              only worth making if the reader can go check it in one click. */}
          <p>
            <button type="button" className="about-link" onClick={onOpenCase}>
              Read the Stage Zero Health case study
            </button>
          </p>
        </div>
        <div className="aside">
          <p>
            I&apos;m looking for APM or new-grad product roles where I get to
            work with people who are good at what they do, on something that
            actually matters.
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
