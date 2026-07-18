import { z } from "zod";

/**
 * Categories are a closed set on purpose — an open free-text category field
 * is how you end up with "Architecture", "architecture", "Archi " as three
 * different filter buckets six months from now.
 */
export const PROJECT_CATEGORIES = [
  "Architecture",
  "Décoration intérieure",
  "Rénovation",
];

const slugSafe = z
  .string()
  .trim()
  .min(2, "Le titre doit contenir au moins 2 caractères.")
  .max(120, "Le titre est trop long (120 caractères max).");

export const projectCreateSchema = z.object({
  title: slugSafe,
  category: z.enum(PROJECT_CATEGORIES, {
    errorMap: () => ({ message: "Catégorie invalide." }),
  }),
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
