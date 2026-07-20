import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(60, "Le nom est trop long (60 caractères max)."),
});