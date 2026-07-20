"use client";

import { useState } from "react";

export default function MobileNavToggle({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="navbar-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>
      <div
        className={`navbar-mobile-panel${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
      >
        {children}
      </div>
    </>
  );
}