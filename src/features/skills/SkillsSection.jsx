"use client"
import { useEffect, useState } from "react";

export default function SkillsSection() {

    const [skills, setSkills] = useState([]);

    useEffect(() => {
        async function loadSkills() {
            const response = await fetch("/api/skills");
            const data = await response.json();

            setSkills(data.data);
        }

        loadSkills();
    }, []);

    return (
        <section>
            <h2>
                Skills
            </h2>
            {skills.map((skill) =>
            <article key={skill.id}>
                <h3>{skill.name}</h3>

            {skill.Skill_category.map((connection) =>
            <p key={connection.Categories.id}>
                {connection.Categories.name}
            </p>
            )}
            </article>
            )}
        </section>
    )
}