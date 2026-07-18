import DOMPurify from "isomorphic-dompurify";
import {
  isKnownContentKey,
  getBlockType,
  contentBlockSchema,
  valeursListSchema,
  expertiseListSchema,
} from "@bsma/shared";
import prisma from "../lib/prisma.js";

// Deliberately no "style" in ALLOWED_ATTR — free-form inline CSS from a
// rich-text editor is a real vector (background:url() exfiltration,
// layout hijacking) and structured styling is handled separately via the
// `styles` JSON column, validated by blockStylesSchema on the client form.
const RICH_TEXT_TAGS = ["p", "br", "strong", "em", "u", "h1", "h2", "h3", "ul", "ol", "li", "span", "a"];
const RICH_TEXT_ATTR = ["href", "target", "rel"];

const sanitizeByType = (type, value) => {
  switch (type) {
    case "richText":
      return DOMPurify.sanitize(value, { ALLOWED_TAGS: RICH_TEXT_TAGS, ALLOWED_ATTR: RICH_TEXT_ATTR });
    case "plainText":
      return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    case "url": {
      // Reject anything that isn't a plausible http(s) URL or a root-relative
      // path — this is what stops `javascript:alert(1)` links.
      const trimmed = value.trim();
      if (trimmed === "") return "";
      const isSafe = /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/");
      if (!isSafe) throw new Error("URL invalide.");
      return trimmed;
    }
    default:
      throw new Error("Type de contenu inconnu.");
  }
};

// GET /api/content/:section — public
export const getSection = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await prisma.content.findMany({ where: { section } });
    const result = {};
    content.forEach((item) => {
      result[item.key] = { value: item.value, styles: item.styles };
    });
    res.json(result);
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PUT /api/content/:section/:key — protected
export const updateContent = async (req, res) => {
  try {
    const { section, key } = req.params;

    // Deny-by-default: only (section, key) pairs the admin UI is actually
    // supposed to expose can ever be written, regardless of what the
    // request body contains.
    if (!isKnownContentKey(section, key)) {
      return res.status(400).json({ error: "Champ de contenu inconnu." });
    }

    const parsed = contentBlockSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Contenu invalide." });
    }

    const blockType = getBlockType(section, key);
    let { value, styles } = parsed.data;

    // "valeurs" / "expertise" are JSON-encoded repeatable lists, not
    // free-text — validate the decoded structure instead of sanitizing it
    // as HTML (it isn't HTML).
    if (section === "about" && (key === "valeurs" || key === "expertise")) {
      let decoded;
      try {
        decoded = JSON.parse(value);
      } catch {
        return res.status(400).json({ error: "Format JSON invalide." });
      }
      const listSchema = key === "valeurs" ? valeursListSchema : expertiseListSchema;
      const listResult = listSchema.safeParse(decoded);
      if (!listResult.success) {
        return res.status(400).json({ error: "Structure de liste invalide." });
      }
      value = JSON.stringify(listResult.data);
    } else {
      try {
        value = sanitizeByType(blockType, value);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }

    const content = await prisma.content.upsert({
      where: { section_key: { section, key } },
      update: { value, styles },
      create: { section, key, value, styles },
    });

    res.json(content);
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
};
