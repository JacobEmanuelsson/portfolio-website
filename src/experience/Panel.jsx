"use client";

// one full-screen panel — css shows only the active one and fades between them
export default function Panel({ index, isActive, children }) {
  return (
    <div
      className={isActive ? "panel active" : "panel"} // .active flips opacity/scale in css
      data-index={index}
      aria-hidden={!isActive} // keep inactive panels out of the a11y tree
    >
      {children}
    </div>
  );
}
