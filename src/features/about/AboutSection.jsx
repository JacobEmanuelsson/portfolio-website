import "./AboutSection.css";

// Files in public can be linked from the website root.
const cvUrl = "/cv/Jacob-Emanuelsson-CV.pdf";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-heading"
      data-scrollable
      tabIndex={0}
    >
      <header className="about-section__header section-reveal">
        <p className="section-label">About me</p>
        <h2 id="about-heading">
          Curious about technology.
          <span>Always up for a challenge.</span>
        </h2>
      </header>

      <div className="about-section__content section-reveal section-reveal-content">
        <p>
          I’m Jacob, a junior developer with an interest in new technology and
          how things work. I enjoy exploring ideas, trying different approaches,
          and turning what I learn into something useful.
        </p>
        <p>
          What draws me to development is the mix of creativity and problem
          solving. There’s always something new to understand, whether it’s a
          tool, a technique, or a different way of approaching a problem. I’m
          still developing my skills and finding my own style, and I enjoy
          seeing my progress as things start to come together.
        </p>
        <p>
          When I’m not coding, I enjoy going to the gym and playing video games.
          Both give me a chance to unwind, challenge myself, and focus on
          something different.
        </p>

        {/* Only show the link when a CV is available. */}
        {cvUrl && (
          <a className="about-section__cv section-reveal section-reveal-links" href={cvUrl} target="_blank" rel="noopener noreferrer">
            View my CV <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </section>
  );
}
