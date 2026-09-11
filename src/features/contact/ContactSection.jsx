"use client";
import "./ContactSection.css"
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


    const email = socials.find((social) => 
        social.link?.startsWith("mailto:")
    );

    const otherSocials = socials.filter((social) =>
        social.link && !social.link.startsWith("mailto:")
    );


    const [copyMessage, setCopyMessage] = useState("");

    // Restore the email address two seconds after showing feedback.
    useEffect(() => {
        if (!copyMessage) return;
        const timer = setTimeout(() => setCopyMessage(""), 2000);
        return () => clearTimeout(timer);
    }, [copyMessage]);

    async function copyEmail() {
        if (copyMessage) return;
        if(!email) {
            return;
        }

        const address = email.link.replace("mailto:", "");

        try {
            await navigator.clipboard.writeText(address);
            setCopyMessage("Copied!");
        } catch {
            setCopyMessage("Could not copy. Try again.");
        }
    }
    return (
        <section id="contact" className="contact-section" data-scrollable tabIndex={0}>
            <header className="section-header section-reveal">
                <p className="section-label">Contact</p>
                <h2>Let’s get in touch.</h2>
            </header>

            <p className="contact-section__description section-reveal section-reveal-content">
                I’m open to new opportunities, interesting projects, and
                collaborations. If you have something in mind or just want
                to say hello, I’d love to hear from you.
            </p>

            <div className="section-reveal section-reveal-links">
                {email && (
                <div className="contact-section__email-box">
                    <button
                    type="button"
                    className="contact-section__email"
                    onClick={copyEmail}
                    aria-label={copyMessage || "Copy email address"}
                    title="Click to copy email address"
                    >
                    {/* Keep the original width so the button does not shrink. */}
                    <span className="contact-section__email-address" style={{ visibility: copyMessage ? "hidden" : "visible" }}>
                        {email.link.replace("mailto:", "")}
                    </span>
                    <span className="contact-section__email-feedback" role="status">
                        {copyMessage}
                    </span>
                    </button>
                </div>
                )}

                <div className="contact-section__socials">
                {otherSocials.map((social) => (
                    <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {social.name} <span aria-hidden="true">↗</span>
                    </a>
                ))}
                </div>
            </div>
        </section>
    );

}
