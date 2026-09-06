"use client";
import { useDeck } from "./DeckContext";

export default function Panel({ index, children }) {
  const { activeIndex } = useDeck();
  const isActive = index === activeIndex;

  return (
    <div
      className={isActive ? "panel active" : "panel"}
      data-index={index}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}
