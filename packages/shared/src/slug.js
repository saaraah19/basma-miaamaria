import slugify from "slugify";
import { customAlphabet } from "nanoid";

// Short, URL-safe, no ambiguous characters (no 0/O/1/I) so it reads cleanly
// if it ever ends up visible, e.g. shared in a chat.
const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 6);

export const buildSlug = (title) => {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 80);
  return `${base}-${nanoid()}`;
};