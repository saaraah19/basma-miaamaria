// next/image loader for the static export. Cloudinary resizes on the fly from
// the URL, so there is nothing to host: we just ask it for the width Next
// needs. `c_limit` means "never upscale a smaller original".
export default function cloudinaryLoader({ src, width }) {
  const marker = "/upload/";
  const i = src.indexOf(marker);
  if (!src.includes("res.cloudinary.com") || i === -1) return src; // e.g. /logo_bsma.jpg

  const head = src.slice(0, i + marker.length);
  const tail = src.slice(i + marker.length);

  // The app already requests pre-sized URLs in places (see lib/cloudinary-url.js,
  // e.g. ".../upload/w_600,q_auto,f_auto/v123/..."). Respect them as-is rather
  // than stacking a second transformation on top.
  const alreadyTransformed = /^[a-z]{1,3}_[^/]+\//.test(tail);
  if (alreadyTransformed) return src;

  return `${head}c_limit,w_${width},q_auto,f_auto/${tail}`;
}
