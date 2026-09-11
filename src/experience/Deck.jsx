"use client";

import { Children, useEffect, useRef, useState } from "react";
import Panel from "./Panel";
import NameStars from "./NameStars";
import SectionNav from "./SectionNav";

const TRANSITION_MS = 780;
const WHEEL_IDLE_MS = 150;
const WHEEL_MIN_DELTA = 4;
const SWIPE_THRESHOLD = 40;

export default function Deck({ children }) {
  const items = Children.toArray(children);
  const count = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [entering, setEntering] = useState(false);

  const activeRef = useRef(0);
  const lockRef = useRef(false);


  function jump(i) {
    setActiveIndex(i);
  }

  useEffect(() => {
    let navigationTimer;
    function goTo(i) {
      i = Math.max(0, Math.min(count - 1, i))
      if (i === activeRef.current || lockRef.current) {
        return;
      }
      // Finish the name animation before opening the first section.
      if (activeRef.current === 0 && i > 0 &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lockRef.current = true;
        setEntering(true);
        navigationTimer = setTimeout(() => {
          activeRef.current = i;
          setActiveIndex(i);
          setEntering(false);
          navigationTimer = setTimeout(() => { lockRef.current = false; }, TRANSITION_MS);
        }, 1500);
        return;
      }

      lockRef.current = true;
      activeRef.current = i;
      setActiveIndex(i);
      navigationTimer = setTimeout(() => {lockRef.current = false;}, TRANSITION_MS);

    }

    
    function advance(dir) {
      goTo(activeRef.current + dir);
    }
    // The intro button uses the same navigation as scrolling.
    function onClick(e) {
      if (e.target.closest("[data-enter]")) goTo(1);
    }

    // --- wheel: one physical flick = one panel move ---
    let wheelReady = true;
    let wheelIdleTimer;
    // Leave scrolling to the panel when its content does not fit.
    function needsInnerScroll(target) {
      const panel = target.closest("[data-scrollable]");
      return panel && panel.scrollHeight > panel.clientHeight + 1;
    }

    function onWheel(e) {
      if (needsInnerScroll(e.target)) return;
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
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (needsInnerScroll(e.target)) return;
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
    let scrollingInsidePanel = false;
    function onTouchStart(e) {
      touchStartY = e.touches[0].clientY;
      scrollingInsidePanel = needsInnerScroll(e.target);
    }
    function onTouchMove(e) {
      if (scrollingInsidePanel || e.touches.length > 1) return;
      e.preventDefault();
    }
    function onTouchEnd(e) {
      if (scrollingInsidePanel || e.touches.length > 0) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return; // a tap, not a swipe
      advance(dy > 0 ? 1 : -1); // swipe up => forward
    }

    window.addEventListener("click", onClick);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      clearTimeout(wheelIdleTimer);
      clearTimeout(navigationTimer);
    };
  }, [count]); 


  

  return (
    <div className={"stage" + (activeIndex === 0 ? " is-intro" : "") + (entering ? " is-entering" : "")}>
      <NameStars running={entering} />
      {items.map((child, i) => (
        <Panel key={i} index={i} isActive={i === activeIndex}>
          {child}
        </Panel>
      ))}
      <SectionNav
        activeIndex={activeIndex}
        onNavigation={jump}
      />
    </div>
  );
}


