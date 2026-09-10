"use client";
import { useEffect, useState, useMemo } from "react";
import "./SkillsSection.css";

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  // skills — each row carries its category links (Skill_category)
  useEffect(() => {
    async function loadSkills() {
      const response = await fetch("/api/skills");
      const data = await response.json();
      setSkills(data.data);
    }
    loadSkills();
  }, []);

  // categories — flat list, used to build the groups
  useEffect(() => {
    async function loadCategories() {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.data);
    }
    loadCategories();
  }, []);

  // group the skills under each category, drop categories with nothing in them
  const clusters = useMemo(() => {
    return categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        skills: skills.filter((skill) =>
          skill.Skill_category?.some((link) => link.Categories?.id === category.id)
        ),
      }))
      .filter((cluster) => cluster.skills.length > 0);
  }, [categories, skills]);

  return (
    <section className="content-panel skills-panel" data-scrollable tabIndex={0} aria-labelledby="skills-heading">
      <p className="section-label section-reveal">capabilities</p>
      <h2 id="skills-heading" className="section-reveal">What I can do</h2>

      {/* one block per category, its skills as tags inside */}
      {clusters.map((cluster) => (
        <div className="skills-cluster section-reveal section-reveal-content" key={cluster.id}>
          <h3 className="skills-cluster-title" data-reveal>{cluster.name}</h3>
          <ul className="skills-tags">
            {cluster.skills.map((skill) => (
              <li key={skill.id} className="skills-tag" data-reveal>
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
