"use client";

import { Children, useEffect, useRef, useState } from "react";
import Panel from "./Panel";

const TRANSITION_MS = 780;
const WHEEL_IDLE_MS = 150;
const WHEEL_MIN_DELTA = 4;
const SWIPE_THRESHOLD = 40;

export default function Deck({ children }) {
  const items = Children.toArray(children);
  const count = items.length;

  const [activeIndex, setActiveIndex] = useState(0);

  const activeRef = useRef(0);
  const lockRef = useRef(false);

  useEffect(() => {
    function goTo(i) {
      i = Math.max(0, Math.min(count - 1, i))
      if (i === activeRef.current || lockRef.current) {
        return;
      }
      lockRef.current = true;
      activeRef.current = i;
      setActiveIndex(i);
      setTimeout(() => {lockRef.current = false;}, TRANSITION_MS);

    }


    function advance(dir) {
      goTo(activeRef.current + dir);
    }
    // --- wheel: one physical flick = one panel move ---
    let wheelReady = true;
    let wheelIdleTimer;
    function onWheel(e) {
      e.preventDefault();
      if (Math.abs(e.deltaY) < WHEEL_MIN_DELTA) return;
      clearTimeout(wheelIdleTimer);
      wheelIdleTimer = setTimeout(() => { wheelReady = true; }, WHEEL_IDLE_MS);
      if (!wheelReady) return;
      wheelReady = false;
      advance(e.deltaY > 0 ? 1 : -1);
    }

    // --- keyboard ---
    function onKey(e) {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        advance(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        advance(-1);
      } else if (e.code === "Space" || e.code === "Enter") {
        if (e.target?.closest?.("button, a, input, textarea, select")) return;
        if (activeRef.current === 0) advance(1);
      }
    }

    // --- touch / swipe ---
    let touchStartY = 0;
    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      if (e.target?.closest?.("[data-scrollable]")) return; // allow inner scroll
      e.preventDefault();
    }
    function onTouchEnd(e) {
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return; // a tap, not a swipe
      advance(dy > 0 ? 1 : -1); // swipe up => forward
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      clearTimeout(wheelIdleTimer);
    };
  }, [count]); 

  return (
    <div className="stage">
      {items.map((child, i) => (
        <Panel key={i} index={i} isActive={i === activeIndex}>
          {child}
        </Panel>
      ))}
    </div>
  );
}