// Server-to-server call to the Next.js app's on-demand revalidation route.
// This intentionally lives in the API, not the browser — the secret used
// here is a real server-only env var, never bundled into client JS. The
// old approach sent NEXT_PUBLIC_REVALIDATE_SECRET from admin-queries.js,
// but anything prefixed NEXT_PUBLIC_ ships inside the browser bundle and
// is readable by anyone via devtools — that defeated the whole check.
const SITE_URL = process.env.CLIENT_URL;
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function revalidateTag(tag) {
  if (!SITE_URL || !REVALIDATE_SECRET) {
    console.error("revalidateTag skipped: CLIENT_URL or REVALIDATE_SECRET not set");
    return;
  }
  try {
    await fetch(`${SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, secret: REVALIDATE_SECRET }),
    });
  } catch (err) {
    // Best-effort — worst case the public page just waits out the ISR window.
    console.error(`revalidateTag("${tag}") failed:`, err.message);
  }
}