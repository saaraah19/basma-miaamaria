"use client";

import { useState } from "react";
import * as Icons from "react-icons/fa";
import { serviceSchema } from "@bsma/shared";
import { useServicesQuery, useServiceMutations } from "@/lib/admin-queries";
import IconPicker from "../IconPicker";
import "./ServicesEditor.css";

const EMPTY_FORM = { icon: "", title: "", description: "" };

export default function ServicesEditor() {
  const { data: services = [], isLoading } = useServicesQuery();
  const { create, update, remove } = useServiceMutations();

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) return <p className="section-loading">Chargement…</p>;

  const validateAndSubmit = async (mutation, extra = {}) => {
    setError("");
    const result = serviceSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }
    try {
      await mutation.mutateAsync(extra.id ? { id: extra.id, data: result.data } : result.data);
      setShowNew(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.response?.data?.error ?? "Erreur lors de l'enregistrement.");
    }
  };

  const rowStyle = { border: "1px solid var(--color-border)", borderRadius: "8px", padding: "0.9rem 1rem", marginBottom: "0.5rem", background: "var(--color-surface)" };

  return (
    <div className="admin-card">
      <div className="services-editor-header">
        <span className="section-label" style={{ marginBottom: 0 }}>Services ({services.length})</span>
        <button className="btn-primary" onClick={() => { setShowNew(true); setForm(EMPTY_FORM); }}>+ Ajouter</button>
      </div>

      {error && <div className="text-block-error">{error}</div>}

      {showNew && (
        <div style={{ ...rowStyle, background: "var(--color-bg)", marginBottom: "1rem" }}>
          <p className="services-form-label">Nouveau service</p>
          <IconPicker value={form.icon} onChange={(iconName) => setForm((p) => ({ ...p, icon: iconName }))} />
          <div className="form-group">
            <label>Titre</label>
            <input className="admin-input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} />
          </div>
          <div className="services-form-actions">
            <button className="btn-success" onClick={() => validateAndSubmit(create)} disabled={create.isPending}>Créer</button>
            <button className="btn-secondary" onClick={() => setShowNew(false)}>Annuler</button>
          </div>
        </div>
      )}

      {services.map((s) => (
        <div key={s.id} style={rowStyle}>
          {editId === s.id ? (
            <>
              <IconPicker value={form.icon} onChange={(iconName) => setForm((p) => ({ ...p, icon: iconName }))} />
              <div className="form-group">
                <label>Titre</label>
                <input className="admin-input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="admin-textarea" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} />
              </div>
              <div className="services-form-actions">
                <button className="btn-success" onClick={() => validateAndSubmit(update, { id: s.id })} disabled={update.isPending}>Sauvegarder</button>
                <button className="btn-secondary" onClick={() => setEditId(null)}>Annuler</button>
              </div>
            </>
          ) : (
            <div className="services-row-view">
              <div className="services-row-info">
                <span className="services-row-icon">
                  {s.icon?.startsWith("Fa") ? (() => { const I = Icons[s.icon]; return I ? <I /> : s.icon; })() : s.icon}
                </span>
                <div>
                  <p className="services-row-title">{s.title}</p>
                  <p className="services-row-desc">{s.description}</p>
                </div>
              </div>
              <div className="services-row-actions">
                <button
                  className="btn-secondary"
                  style={{ fontSize: "0.775rem", padding: "0.4rem 0.75rem" }}
                  onClick={() => { setEditId(s.id); setForm({ icon: s.icon, title: s.title, description: s.description }); setError(""); }}
                >✏️</button>
                <button className="btn-danger" style={{ padding: "0.4rem 0.65rem" }} onClick={() => remove.mutate(s.id)}>🗑</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
