import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.CONTACT_EMAIL;

// User-supplied strings (name, message, details...) are already validated
// for length/shape by zod, but they're still arbitrary text — escaping
// before interpolating into an HTML email body stops someone from
// injecting markup that renders oddly (or worse) in the recipient's inbox.
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const nl2br = (str = "") => escapeHtml(str).replace(/\n/g, "<br>");

export const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  const result = await resend.emails.send({
    from: "BSMA Contact <onboarding@resend.dev>",
    to: TO,
    replyTo: email,
    subject: `[Contact] ${escapeHtml(subject)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #a5874b;">Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone:</strong> ${escapeHtml(phone) || "—"}</p>
        <p><strong>Sujet:</strong> ${escapeHtml(subject)}</p>
        <div style="background: #f9f9f7; padding: 1rem;">
          <p><strong>Message:</strong></p>
          <p>${nl2br(message)}</p>
        </div>
      </div>
    `,
  });
  return result;
};

export const sendDevisEmail = async ({ name, email, phone, projectType, surface, budget, details }) => {
  const result = await resend.emails.send({
    from: "BSMA Devis <onboarding@resend.dev>",
    to: TO,
    replyTo: email,
    subject: `[Devis] ${escapeHtml(projectType)} — ${escapeHtml(name)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #a5874b;">Nouvelle demande de devis</h2>
        <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Type de projet:</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Surface:</strong> ${escapeHtml(surface) || "—"} m²</p>
        <p><strong>Budget estimé:</strong> ${escapeHtml(budget) || "—"}</p>
        ${details ? `
        <div style="background: #f9f9f7; padding: 1rem;">
          <p><strong>Détails:</strong></p>
          <p>${nl2br(details)}</p>
        </div>` : ""}
      </div>
    `,
  });
  return result;
};
