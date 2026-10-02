"use client";

import { useEffect, useState } from "react";
import "./ProjectSection.css";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load projects.");
        }

        setProjects(result.data ?? []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-heading" data-scrollable tabIndex={0}>
      <header className="projects-section__header section-reveal">
        <p className="section-label">Selected work</p>
        <h2 id="projects-heading">Projects I&apos;ve built</h2>
      </header>

      {loading && <p className="projects-section__message">Loading projects...</p>}
      {error && <p className="projects-section__message">{error}</p>}
      {!loading && !error && projects.length === 0 && (
        <p className="projects-section__message">Finished projects will appear here soon.</p>
      )}

      <div className="projects-list">
        {projects.map((project, index) => {
          const skills = project.Project_skills?.map((link) => link.Skills).filter(Boolean) ?? [];
          const coverUrl = project.cover_url || (project.repo_url === "https://github.com/JacobEmanuelsson/wallet-app" ? "/images/wallet-app-dashboard.jpg" : "");

          return (
            <article className="project-spotlight" key={project.id}>
              <div className="project-spotlight__content section-reveal section-reveal-content">
                <p className="project-spotlight__number">{String(index + 1).padStart(2, "0")}</p>
                <h3>{project.title}</h3>
                <p className="project-spotlight__description">{project.description}</p>

                {skills.length > 0 && (
                  <ul className="project-spotlight__skills" aria-label="Technologies used">
                    {skills.map((skill) => <li key={skill.id}>{skill.name}</li>)}
                  </ul>
                )}

                <div className="project-spotlight__links section-reveal section-reveal-links">
                  {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Visit project <span aria-hidden="true">↗</span></a>}
                  {project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a>}
                </div>
              </div>

              <figure className="project-spotlight__preview section-reveal section-reveal-content">
                {/* A screenshot URL can come from Supabase Storage or public/images. */}
                {coverUrl && !failedImages.includes(project.id) ? (
                  <img
                    className="project-spotlight__image"
                    src={coverUrl}
                    alt={project.title + " project preview"}
                    loading="lazy"
                    onError={() => setFailedImages((ids) => [...ids, project.id])}
                  />
                ) : (
                  <div className="project-spotlight__illustration">
                    {project.title.toLowerCase().includes("wallet") ? (
                      <div className="project-spotlight__wallet" aria-hidden="true">
                        <span className="project-spotlight__currency">SEK</span>
                        <span className="project-spotlight__transfer">↔</span>
                        <span className="project-spotlight__currency">EUR</span>
                        <span className="project-spotlight__currency">USD</span>
                      </div>
                    ) : (
                      <span className="project-spotlight__orbit" aria-hidden="true" />
                    )}
                    <p>{project.title}</p>
                    {project.tagline && <span className="project-spotlight__tagline">{project.tagline}</span>}
                    <small>Project illustration</small>
                  </div>
                )}
              </figure>
            </article>
          );
        })}
      </div>
    </section>
  );
}
