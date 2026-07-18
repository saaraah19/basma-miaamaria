import { z } from "zod";

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The old app stored every editable text block as a free-form
 * { value: string, styles: json } blob and trusted the client to send
 * only "safe" HTML. That's how you get stored XSS: whoever holds a
 * valid admin session can write a <script> or an event handler once,
 * and it renders for every visitor forever.
 *
 * Fix: content is typed per block.
 *  - "richText"  -> sanitized HTML, a small allowlist of tags, NO style attr
 *  - "plainText" -> tags stripped entirely
 *  - "url"       -> must parse as a URL
 * Structured styling (color/alignment/weight) is a plain object with an
 * enum of allowed values — never a raw CSS string that could smuggle
 * `background:url(//evil)` or break out of its rule.
 */

export const BLOCK_TYPES = ["richText", "plainText", "url"];

export const blockStylesSchema = z
  .object({
    color: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Couleur invalide.")
      .optional(),
    textAlign: z.enum(["left", "center", "right"]).optional(),
    fontWeight: z.enum(["normal", "medium", "semibold", "bold"]).optional(),
  })
  .strict()
  .optional();

export const contentBlockSchema = z.object({
  value: z.string().max(10000, "Contenu trop long."),
  styles: blockStylesSchema,
});

/**
 * Registry: every (section, key) pair the admin panel is allowed to write,
 * and what kind of content it is. Anything not listed here is rejected —
 * this is a safe default (deny unknown fields) instead of trusting the
 * client to only send keys the UI currently shows.
 */
export const CONTENT_REGISTRY = {
  hero: {
    title: "richText",
    subtitle: "richText",
    btn_text: "plainText",
    btn_link: "url",
    bg_image: "url",
  },
  home: {
    services_title: "richText",
    projects_title: "richText",
  },
  about: {
    title: "richText",
    subtitle: "richText",
    histoire_title: "richText",
    histoire_1: "richText",
    histoire_2: "richText",
    valeurs_title: "richText",
    valeurs: "plainText", // JSON-encoded array, validated separately below
    expertise_title: "richText",
    expertise: "plainText", // JSON-encoded array, validated separately below
    cta_title: "richText",
    cta_button: "plainText",
  },
  contact: {
    title: "richText",
    subtitle: "richText",
    maps_url: "url",
    calendly: "url",
    btn_devis_text: "plainText",
    btn_devis_link: "url",
    btn_rdv_text: "plainText",
    form_btn_text: "plainText",
  },
  navbar: {
    site_name: "plainText",
    btn_devis_text: "plainText",
  },
  footer: {
    tagline: "richText",
    description: "richText",
    phone: "plainText",
    email: "plainText",
    address: "plainText",
    facebook: "url",
    instagram: "url",
    pinterest: "url",
    linkedin: "url",
  },
  contact_page: {
    hero_title: "richText",
    hero_subtitle: "richText",
    address: "plainText",
    phone: "plainText",
    email: "plainText",
    hours_1: "plainText",
    hours_2: "plainText",
    facebook: "url",
    instagram: "url",
    submit_btn: "plainText",
  },
  devis: {
    title: "richText",
    subtitle: "richText",
    submit_btn: "plainText",
  },
};

export const isKnownContentKey = (section, key) =>
  Boolean(CONTENT_REGISTRY[section]?.[key]);

export const getBlockType = (section, key) =>
  CONTENT_REGISTRY[section]?.[key] ?? null;

// Structured schema for the "valeurs" (values) repeatable list
export const valeurItemSchema = z.object({
  icon: z.string().trim().min(1).max(4),
  label: z.string().trim().min(1).max(60),
  desc: z.string().trim().min(1).max(160),
});
export const valeursListSchema = z.array(valeurItemSchema).max(12);

// Structured schema for the "expertise" repeatable list
export const expertiseItemSchema = z.object({
  icon: z.string().trim().min(1).max(4),
  label: z.string().trim().min(1).max(60),
});
export const expertiseListSchema = z.array(expertiseItemSchema).max(12);
