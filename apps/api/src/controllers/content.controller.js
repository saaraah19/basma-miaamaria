// after
import DOMPurify from "isomorphic-dompurify";
import {
  isKnownContentKey,
  getBlockType,
  contentBlockSchema,
  valeursListSchema,
  expertiseListSchema,
} from "@bsma/shared";
import prisma from "../lib/prisma.js";
import { revalidateTag } from "../lib/revalidate.js";

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
  } catch(err) {
       console.error("getSection error:", err);

    res.status(500).json({ error: "Erreur serveur." });
  }
};

// new — GET /api/content/:section/admin — protected
// Same as getSection but includes draft fields, for the admin editors
// working on unpublished changes. Never exposed on the public route.
export const getSectionAdmin = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await prisma.content.findMany({ where: { section } });
    const result = {};
    content.forEach((item) => {
      result[item.key] = {
        value: item.value,
        styles: item.styles,
        hasDraft: item.hasDraft,
        draftValue: item.draftValue,
        draftStyles: item.draftStyles,
      };
    });
    res.json(result);
  } catch (err) {
    console.error("getSectionAdmin error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// PUT /api/content/:section/:key — protected
// after
// PUT /api/content/:section/:key — protected
// By default this saves a DRAFT (never touches the published value/styles,
// never revalidates the public site). Pass `publish: true` in the body to
// save and publish atomically in one call — used by editors that never had
// a draft workflow to begin with (hero background image, valeurs/expertise
// lists) so their existing "save = live immediately" behavior is unchanged.
export const updateContent = async (req, res) => {
  try {
    const { section, key } = req.params;

    if (!isKnownContentKey(section, key)) {
      return res.status(400).json({ error: "Champ de contenu inconnu." });
    }

    const parsed = contentBlockSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Contenu invalide." });
    }

    const blockType = getBlockType(section, key);
    let { value, styles } = parsed.data;
    const publishNow = req.body?.publish === true;

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

    const data = publishNow
      ? { value, styles, hasDraft: false, draftValue: null, draftStyles: null }
      : { draftValue: value, draftStyles: styles, hasDraft: true };

    const content = await prisma.content.upsert({
      where: { section_key: { section, key } },
      update: data,
      create: publishNow
        ? { section, key, value, styles }
        : { section, key, draftValue: value, draftStyles: styles, hasDraft: true },
    });

    if (publishNow) {
      revalidateTag(`content:${section}`);
    }

    res.json(content);
  } catch (err){
       console.error("updateContent error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// POST /api/content/:section/:key/publish — protected
// Copies the pending draft into the published value/styles, clears the
// draft, and revalidates — this is the only place a draft ever becomes
// publicly visible.
export const publishContentBlock = async (req, res) => {
  try {
    const { section, key } = req.params;
    if (!isKnownContentKey(section, key)) {
      return res.status(400).json({ error: "Champ de contenu inconnu." });
    }

    const existing = await prisma.content.findUnique({ where: { section_key: { section, key } } });
    if (!existing || !existing.hasDraft) {
      return res.status(400).json({ error: "Aucun brouillon à publier." });
    }

    const content = await prisma.content.update({
      where: { section_key: { section, key } },
      data: {
        value: existing.draftValue,
        styles: existing.draftStyles,
        hasDraft: false,
        draftValue: null,
        draftStyles: null,
      },
    });

    revalidateTag(`content:${section}`);
    res.json(content);
  } catch (err) {
    console.error("publishContentBlock error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// DELETE /api/content/:section/:key/draft — protected
// Discards the pending draft, reverting the admin view back to the
// currently published value. The public site was never affected either way.
export const discardContentDraft = async (req, res) => {
  try {
    const { section, key } = req.params;
    const content = await prisma.content
      .update({
        where: { section_key: { section, key } },
        data: { hasDraft: false, draftValue: null, draftStyles: null },
      })
      .catch(() => null);

    if (!content) return res.status(404).json({ error: "Introuvable." });
    res.json(content);
  } catch (err) {
    console.error("discardContentDraft error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
