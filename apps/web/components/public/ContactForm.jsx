"use client";

import { useState } from "react";

export default function ContactForm({ submitLabel = "Envoyer" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {status === "success" && (
        <div className="success-message">✓ Message envoyé avec succès ! Nous vous recontacterons bientôt.</div>
      )}
      {status === "error" && <div className="error-message">⚠️ {errorMsg}</div>}

      <div className="form-group">
        <label htmlFor="name">Nom complet *</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="votre@email.com" />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Téléphone</label>
        <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+213 6XX XXX XXX" />
      </div>
      <div className="form-group">
        <label htmlFor="subject">Sujet *</label>
        <input id="subject" name="subject" value={form.subject} onChange={handleChange} required placeholder="Sujet du message" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder="Votre message" rows={5} />
      </div>

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi en cours..." : submitLabel}
      </button>
    </form>
  );
}
