"use client";

import { useEffect, useRef } from "react";

export default function NameStars({ running }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const heading = document.getElementById("hero-name");
    if (!context || !heading) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Draw an invisible copy of the name, then read its pixels.
    const copy = document.createElement("canvas");
    copy.width = width;
    copy.height = height;
    const pen = copy.getContext("2d");
    if (!pen) return;
    const style = window.getComputedStyle(heading);
    const box = heading.getBoundingClientRect();
    pen.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
    pen.textAlign = "center";
    pen.textBaseline = "middle";
    pen.fillStyle = "white";
    pen.fillText(heading.textContent, box.left + box.width / 2, box.top + box.height / 2);
    const pixels = pen.getImageData(0, 0, width, height).data;
    const stars = [];

    // Each visible sample becomes a star with a starting and finishing point.
    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        if (pixels[(y * width + x) * 4 + 3] > 100) {
          stars.push({ x, y, endX: Math.random() * width, endY: Math.random() * height,
            size: 0.5 + Math.random(), delay: Math.random() * 0.15 });
        }
      }
    }

    let frame;
    const start = performance.now();
    function draw(now) {
      const progress = Math.min((now - start) / 1500, 1);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#e4dcf0";
      for (const star of stars) {
        const time = Math.max(0, Math.min((progress - star.delay) / 0.85, 1));
        const movement = 1 - Math.pow(1 - time, 3);
        const x = star.x + (star.endX - star.x) * movement;
        const y = star.y + (star.endY - star.y) * movement;
        context.globalAlpha = 1 - progress * 0.85;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();
      }
      if (progress < 1) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  return <canvas ref={canvasRef} className="name-stars" aria-hidden="true" />;
}
