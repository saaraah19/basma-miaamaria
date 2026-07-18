"use client";

import { useState } from "react";
import { useUpdateContentBlock } from "@/lib/admin-queries";
import "./ListFieldEditor.css";

/**
 * `fields` describes each column: [{ key: "icon", placeholder: "✓", width: "52px" }, ...]
 * `schema` is valeursListSchema or expertiseListSchema from @bsma/shared.
 */
export default function ListFieldEditor({ section, blockKey, label, fields, schema, initialItems, emptyItem }) {
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isPending } = useUpdateContentBlock(section);

  const update = (index, field, val) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  const add = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const remove = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    setError("");
    const result = schema.safeParse(items);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Liste invalide.");
      return;
    }

    mutate(
      { key: blockKey, value: JSON.stringify(result.data) },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
        onError: (err) => setError(err.response?.data?.error ?? "Erreur lors de la sauvegarde."),
      }
    );
  };

  return (
    <div className="list-field-editor">
      <div className="list-field-header">
        <span className="text-block-label">{label} ({items.length})</span>
        <button className="btn-secondary" onClick={add}>+ Ajouter</button>
      </div>

      {error && <div className="text-block-error">{error}</div>}

      {items.map((item, i) => (
        <div key={i} className="list-field-row">
          <div
            className="list-field-inputs"
            style={{ gridTemplateColumns: `${fields.map((f) => f.width ?? "1fr").join(" ")} auto` }}
          >
            {fields.map((f) => (
              <input
                key={f.key}
                className="admin-input"
                value={item[f.key]}
                onChange={(e) => update(i, f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            ))}
            <button className="btn-danger" onClick={() => remove(i)}>🗑</button>
          </div>
        </div>
      ))}

      <div className="list-field-footer">
        <button className="btn-success" onClick={handleSave} disabled={isPending}>
          {isPending ? "Sauvegarde..." : "Sauvegarder"}
        </button>
        {saved && <span className="save-indicator">✓ Sauvegardé</span>}
      </div>
    </div>
  );
}
