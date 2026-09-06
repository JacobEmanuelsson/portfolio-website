"use client";

import { Children } from "react";
import { DeckProvider } from "./DeckContext";
import Panel from "./Panel";

// turns the page's sections into a paginated deck — one section = one panel
export default function Deck({ children }) {
  const items = Children.toArray(children); // sections from page.jsx, as an array

  return (
    <DeckProvider count={items.length}>
      <div className="stage">
        {/* wrap each section in a Panel and number it 0..n */}
        {items.map((child, i) => (
          <Panel key={i} index={i}>{child}</Panel>
        ))}
      </div>
    </DeckProvider>
  );
}
