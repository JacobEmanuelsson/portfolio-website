"use client";

import { Children } from "react";
import { DeckProvider } from "./DeckContext";
import Panel from "./Panel";

export default function Deck({ children }) {
  const items = Children.toArray(children);
  return (
    <DeckProvider count={items.length}>
      <div className="stage">
        {items.map((child, i) => (
          <Panel key={i} index={i}>{child}</Panel>
        ))}
      </div>
    </DeckProvider>
  );
}
