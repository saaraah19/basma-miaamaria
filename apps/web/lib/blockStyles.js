const FONT_WEIGHT_MAP = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/**
 * Converts a validated block style token ({ color, textAlign, fontWeight })
 * into a real React style object. Anything not present is simply omitted
 * (falls back to the element's own CSS), so partial styling — e.g. just a
 * color override — works without needing every field set.
 */
export function toInlineStyle(styles) {
  if (!styles) return undefined;
  const out = {};
  if (styles.color) out.color = styles.color;
  if (styles.textAlign) out.textAlign = styles.textAlign;
  if (styles.fontWeight) out.fontWeight = FONT_WEIGHT_MAP[styles.fontWeight];
  return out;
}
