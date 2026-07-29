export function Contact() {
  return (
    <section className="block contact-block">
      <div className="contact-grid">
        <div>
          <h2 className="sec">Let&apos;s talk about your product.</h2>
          <p>
            I&apos;m looking for early-career product roles. If you&apos;re
            hiring, or you just want the raw evidence behind any piece here, the
            fastest way to reach me is email.
          </p>
        </div>
        <div>
          <ul className="channels">
            <li>
              <a href="mailto:jayanthadityaaa@gmail.com">
                <span className="lab">Email</span>
                <span className="val">jayanthadityaaa@gmail.com</span>
                <span className="arw">→</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jayanth-kappagantula/"
                target="_blank"
                rel="noopener"
              >
                <span className="lab">LinkedIn</span>
                <span className="val">
                  linkedin.com/in/jayanth-kappagantula
                </span>
                <span className="arw">↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/ThisisjayK"
                target="_blank"
                rel="noopener"
              >
                <span className="lab">GitHub</span>
                <span className="val">ThisisjayK</span>
                <span className="arw">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
