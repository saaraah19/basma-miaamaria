"use client";

import { useState } from "react";
import { devisFormSchema } from "@bsma/shared";

const PROJECT_TYPES = [
  { value: "architecture", label: "Architecture" },
  { value: "interieur", label: "Décoration intérieure" },
  { value: "rénovation", label: "Rénovation" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  surface: "",
  budget: "",
  details: "",
};

export default function DevisForm({ submitLabel = "Envoyer ma demande" }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = devisFormSchema.safeParse(form);
    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        errors[issue.path.join(".")] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }

      setStatus("success");
      setForm(EMPTY_FORM);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="devis-form" noValidate>
      {status === "success" && (
        <div className="devis-success">✓ Demande envoyée ! Nous vous recontacterons sous 48h.</div>
      )}
      {status === "error" && <div className="devis-error">⚠️ {errorMsg}</div>}

      <div className="form-group">
        <label htmlFor="name">Nom complet</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Votre adresse email" />
        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="phone">Téléphone</label>
        <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Ex: +213 123 456 789" />
        {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="projectType">Type de projet</label>
        <select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}>
          <option value="">-- Sélectionnez --</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {fieldErrors.projectType && <span className="field-error">{fieldErrors.projectType}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="surface">Surface approximative</label>
        <input id="surface" name="surface" value={form.surface} onChange={handleChange} placeholder="Ex: 120 m²" />
      </div>
      <div className="form-group">
        <label htmlFor="budget">Budget estimé</label>
        <input id="budget" name="budget" value={form.budget} onChange={handleChange} placeholder="Ex : 1 500 000 DA" />
      </div>
      <div className="form-group">
        <label htmlFor="details">Détails supplémentaires</label>
        <textarea id="details" name="details" value={form.details} onChange={handleChange} rows={5} placeholder="Décrivez votre projet..." />
      </div>

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi en cours..." : submitLabel}
      </button>
    </form>
  );
}