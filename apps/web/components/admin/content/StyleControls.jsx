"use client";

import "./StyleControls.css";

const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semi-gras" },
  { value: "bold", label: "Gras" },
];

const ALIGNMENTS = [
  { value: "left", label: "⬅", title: "Aligner à gauche" },
  { value: "center", label: "↔", title: "Centrer" },
  { value: "right", label: "➡", title: "Aligner à droite" },
];

/**
 * `styles` is the validated { color, textAlign, fontWeight } object —
 * never a raw CSS string. Each control writes one key at a time so a
 * partial style (e.g. just a color) is always valid on its own.
 */
export default function StyleControls({ styles, onChange }) {
  const set = (patch) => onChange({ ...styles, ...patch });

  return (
    <div className="style-controls">
      <label className="style-control-color">
        <span>Couleur</span>
        <input
          type="color"
          value={styles?.color ?? "#333333"}
          onChange={(e) => set({ color: e.target.value })}
        />
      </label>

      <div className="style-control-group">
        <span>Alignement</span>
        <div className="style-control-buttons">
          {ALIGNMENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              title={a.title}
              className={styles?.textAlign === a.value ? "is-active" : ""}
              onClick={() => set({ textAlign: a.value })}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <label className="style-control-select">
        <span>Épaisseur</span>
        <select
          value={styles?.fontWeight ?? "normal"}
          onChange={(e) => set({ fontWeight: e.target.value })}
        >
          {FONT_WEIGHTS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
