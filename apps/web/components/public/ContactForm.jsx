"use client";

import { useState } from "react";
import { contactFormSchema } from "@bsma/shared";

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm({ submitLabel = "Envoyer" }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
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

    const result = contactFormSchema.safeParse(form);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
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
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === "success" && (
        <div className="success-message">✓ Message envoyé avec succès ! Nous vous recontacterons bientôt.</div>
      )}
      {status === "error" && <div className="error-message">⚠️ {errorMsg}</div>}

      <div className="form-group">
        <label htmlFor="name">Nom complet *</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" />
        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="phone">Téléphone</label>
        <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+213 6XX XXX XXX" />
        {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="subject">Sujet *</label>
        <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Sujet du message" />
        {fieldErrors.subject && <span className="field-error">{fieldErrors.subject}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Votre message" rows={5} />
        {fieldErrors.message && <span className="field-error">{fieldErrors.message}</span>}
      </div>

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi en cours..." : submitLabel}
      </button>
    </form>
  );
}