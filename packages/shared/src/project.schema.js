import { z } from "zod";

const slugSafe = z
  .string()
  .trim()
  .min(2, "Le titre doit contenir au moins 2 caractères.")
  .max(120, "Le titre est trop long (120 caractères max).");

// Category is no longer a closed enum — it's validated at the API layer
// against the admin-managed Category table (see projects.controller.js
// assertValidCategory). Here we only guard shape/length.
export const projectCreateSchema = z.object({
  title: slugSafe,
  category: z.string().trim().min(1, "Catégorie requise.").max(60, "Catégorie invalide."),
  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(4000, "La description est trop longue (4000 caractères max)."),
  surface: z.string().trim().max(50).optional().or(z.literal("")),
  duration: z.string().trim().max(50).optional().or(z.literal("")),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  order: z.number().int().min(0).optional(),
});

// Updates allow partial edits, plus the isVisible toggle create doesn't need.
export const projectUpdateSchema = projectCreateSchema.partial().extend({
  isVisible: z.boolean().optional(),
});

export const projectReorderImagesSchema = z.array(
  z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })
);
// Validates the PATCH /projects/images/:imageId body — updates only the
// alt-text field on a single image, independent of the reorder/cover
// endpoints.
export const projectImageAltSchema = z.object({
  alt: z.string().trim().max(200, "Texte alternatif trop long (200 caractères max).").optional().or(z.literal("")),
});