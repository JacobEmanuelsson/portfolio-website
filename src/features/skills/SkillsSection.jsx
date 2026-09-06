"use client";
import { useEffect, useState, useMemo } from "react";
import "./SkillsSection.css";

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadSkills() {
      const response = await fetch("/api/skills");
      const data = await response.json();
      setSkills(data.data);
    }
    loadSkills();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.data);
    }
    loadCategories();
  }, []);

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
    <section className="content-panel" data-scrollable>
      <p className="section-label">capabilities</p>
      <h2 data-reveal>What I can do</h2>

      {clusters.map((cluster) => (
        <div className="skills-cluster" key={cluster.id}>
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
