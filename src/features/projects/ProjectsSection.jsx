"use client";

import { useEffect, useState } from "react";
import "./ProjectSection.css";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
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
    <section id="projects" className="projects-section" aria-labelledby="projects-heading" data-scrollable>
      <header className="projects-section__header">
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

          return (
            <article className="project-spotlight" key={project.id}>
              <div className="project-spotlight__content">
                <p className="project-spotlight__number">{String(index + 1).padStart(2, "0")}</p>
                <h3>{project.title}</h3>
                <p className="project-spotlight__description">{project.description}</p>

                {skills.length > 0 && (
                  <ul className="project-spotlight__skills" aria-label="Technologies used">
                    {skills.map((skill) => <li key={skill.id}>{skill.name}</li>)}
                  </ul>
                )}

                <div className="project-spotlight__links">
                  {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Visit project <span aria-hidden="true">↗</span></a>}
                  {project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">View source <span aria-hidden="true">↗</span></a>}
                </div>
              </div>

              <div className="project-spotlight__preview" aria-hidden="true">
                <span className="project-spotlight__orbit" />
                <p>{project.title}</p>
                <small>Project preview</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
