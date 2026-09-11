import "./SectionNav.css";

export default function SectionNav({activeIndex, onNavigation}) {

    const sections = [
        "Home",
        "skills",
        "projects",
        "about",
        "contact"
    ];

    return(
        <nav className="section-nav">
            {sections.map((s, i) => (
            <button
                key={s}
                type="button"
                className={`sectiondot ${activeIndex === i ? "active" : ""}`}
                onClick={() => onNavigation(i)}
                aria-current={activeIndex === i ? "location" : undefined}
            >
                <span className="section-label">{s}</span>
                <span className="dot" aria-hidden="true" />
            </button>
            ))}
        </nav>
    );

}