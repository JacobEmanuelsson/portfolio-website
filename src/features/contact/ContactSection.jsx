"use client";

import { useState, useEffect } from "react";

export default function ContactSection() {
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        async function loadSocials() {
            const response = await fetch("/api/socials");
            const data = await response.json();
            setSocials(data.data);
        }

        loadSocials();
    }, []);

    return (
        <section id="contact" className="page-section">
            <header className="section-header">
                <p>Contact</p>
                <h2>
                    Have something interesting in mind?
                </h2>
                <p>
                    Let's make it real.
                </p>
            </header>
            {socials.map((social) => (
                <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer">
                    {social.name}
                </a>
            ))}
        </section>

        
    );

}