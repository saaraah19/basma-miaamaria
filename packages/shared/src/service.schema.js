import { z } from "zod";

// Icons come from react-icons/fa on the client — validate the naming
// convention rather than an exhaustive list, so new Fa* icons don't need
// a schema update every time.
const iconValue = z
  .string()
  .trim()
  .min(1, "Choisis une icône.")
  .refine(
    (v) => v.startsWith("Fa") || /\p{Emoji}/u.test(v),
    "Icône invalide."
  );

export const serviceSchema = z.object({
  icon: iconValue,
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(500),
  order: z.number().int().min(0).optional(),
});

export const serviceUpdateSchema = serviceSchema.partial();

export const serviceReorderSchema = z.array(
  z.object({
    id: z.string().cuid(),
    order: z.number().int().min(0),
  })
);
