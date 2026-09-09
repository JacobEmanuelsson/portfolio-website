import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-name">
      <h1 id="hero-name">Jacob Emanuelsson</h1>
      <p className="hero-role">Full-stack developer</p>
      <button className="hero-enter" type="button" data-enter>
        Scroll to explore <span aria-hidden="true">↓</span>
      </button>
    </section>
  );
}
