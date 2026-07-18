import prisma from "../lib/prisma.js";
import { sendContactEmail, sendDevisEmail } from "../lib/email.js";

// POST /api/contact — public, body already validated
export const submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const saved = await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, subject, message },
    });

    // Email delivery failing shouldn't fail the whole request — the
    // message is already safely in the DB either way.
    try {
      await sendContactEmail({ name, email, phone, subject, message });
    } catch (emailErr) {
      console.error("Contact email failed (message saved to DB):", emailErr.message);
    }

    res.status(201).json({ success: true, id: saved.id });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
};

// POST /api/devis — public, body already validated
export const submitDevis = async (req, res) => {
  const { name, email, phone, projectType, surface, budget, details } = req.body;

  try {
    const saved = await prisma.devisRequest.create({
      data: {
        name,
        email,
        phone,
        projectType,
        surface: surface || null,
        budget: budget || null,
        details: details || null,
      },
    });

    try {
      await sendDevisEmail({ name, email, phone, projectType, surface, budget, details });
    } catch (emailErr) {
      console.error("Devis email failed (request saved to DB):", emailErr.message);
    }

    res.status(201).json({ success: true, id: saved.id });
  } catch (err) {
    console.error("Devis submission error:", err);
    res.status(500).json({ error: "Erreur lors de l'envoi de la demande." });
  }
};
