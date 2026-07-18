/**
 * Cloudinary lets you request a resized/optimized variant just by editing
 * the URL — no separate upload needed per size. This inserts the
 * transformation segment right after `/upload/`.
 *
 * cldUrl(url, { w: 800 })
 *   → https://res.cloudinary.com/xxx/image/upload/w_800,q_auto,f_auto/v.../img.jpg
 */
export function cldUrl(url, { w, q = "auto", f = "auto" } = {}) {
  if (!url || !url.includes("/upload/")) return url;
  const widthPart = w ? `w_${w},` : "";
  return url.replace("/upload/", `/upload/${widthPart}q_${q},f_${f}/`);
}

/**
 * Builds a srcSet string across common breakpoints. Pass the widths that
 * actually matter for where the image is used — a project card doesn't
 * need a 2000px variant, a hero background does.
 */
export function cldSrcSet(url, widths = [400, 800, 1200, 1600]) {
  if (!url) return undefined;
  return widths.map((w) => `${cldUrl(url, { w })} ${w}w`).join(", ");
}
