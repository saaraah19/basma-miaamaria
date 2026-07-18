import { z } from "zod";

// A loose but real phone check — international formats, spaces, +.
// Not trying to validate deliverability, just reject garbage input.
const phone = z
  .string()
  .trim()
  .min(6, "Numéro de téléphone trop court.")
  .max(20, "Numéro de téléphone trop long.")
  .regex(/^[0-9+\s().-]+$/, "Format de téléphone invalide.");

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court.").max(100),
  email: z.string().trim().email("Email invalide.").max(150),
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Sujet trop court.").max(150),
  message: z.string().trim().min(5, "Message trop court.").max(3000),
});

// The Devis (quote request) form uses free-text categories in French that
// don't perfectly match PROJECT_CATEGORIES casing in the current app —
// normalize here so validation isn't accidentally stricter than the UI.
export const devisFormSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court.").max(100),
  email: z.string().trim().email("Email invalide.").max(150),
  phone,
  projectType: z.enum(["architecture", "interieur", "rénovation"], {
    errorMap: () => ({ message: "Type de projet invalide." }),
  }),
  surface: z.string().trim().max(50).optional().or(z.literal("")),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  details: z.string().trim().max(3000).optional().or(z.literal("")),
});

