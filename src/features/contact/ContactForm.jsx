"use client";

import { useState, useEffect } from "react";

export default function ContactForm() {
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
        <>
            {socials.map((social) => (
                <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer">
                    {social.name}
                </a>
            ))}
        
        </>
    );

}