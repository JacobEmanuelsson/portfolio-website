"use client";
import { useEffect, useState } from "react";
import "./Backdrop.css";

const STAR_COUNT = 70;

export default function Backdrop() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(Array.from({ length: STAR_COUNT }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3.5,
      opacity: 0.2 + Math.random() * 0.5,
      scale: 0.6 + Math.random() * 1.8,
    })));
  }, []);

  return (
    <>
      <div className="backdrop-nebula" aria-hidden="true">
        <span className="backdrop-blob backdrop-blob--b1" />
        <span className="backdrop-blob backdrop-blob--b2" />
        <span className="backdrop-blob backdrop-blob--b3" />
      </div>
      <div className="backdrop-starfield" aria-hidden="true">
        {stars.map((s, i) => (
          <span key={i} className="backdrop-star" style={{
            left: `${s.left}%`, top: `${s.top}%`,
            animationDelay: `${s.delay}s`, opacity: s.opacity,
            transform: `scale(${s.scale})`,
          }} />
        ))}
      </div>
      <div className="backdrop-vignette" aria-hidden="true" />
      <div className="backdrop-grain" aria-hidden="true" />
    </>
  );
}
