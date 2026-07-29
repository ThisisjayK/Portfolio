export function Resume() {
  return (
    <section className="block resume-block">
      <div className="block-head">
        <h2 className="sec">Résumé</h2>
        <p>
          The short version: my experience, the tools I reach for, and my
          education, all on a single page. Grab the PDF, or ask and I&apos;ll
          send a copy tailored to the role.
        </p>
      </div>
      <ul className="channels" style={{ maxWidth: "40ch" }}>
        {/* jayanth-resume.pdf lives in public/ (copied into docs/ on build);
            BASE_URL keeps the link correct under the /Portfolio/ Pages subpath. */}
        <li>
          <a
            href={`${import.meta.env.BASE_URL}jayanth-resume.pdf`}
            download="jayanth-resume.pdf"
          >
            <span className="lab">PDF</span>
            <span className="val">Download résumé</span>
            <span className="arw">↓</span>
          </a>
        </li>
        <li>
          <a href="mailto:jayanthadityaaa@gmail.com">
            <span className="lab">Email</span>
            <span className="val">Ask for a tailored copy</span>
            <span className="arw">→</span>
          </a>
        </li>
      </ul>
    </section>
  );
}
