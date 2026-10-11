// The public site is now a static export, so there is no "revalidate this tag"
// route any more. Instead, content changes ask Render to REBUILD the static
// site through its Deploy Hook. Every controller already calls
// `revalidateTag(...)` after a change, so none of them needed to be touched.
//
// Edits usually come in bursts (save, save, publish...), so rebuilds are
// debounced: we wait until 90 s pass with no further change, then trigger one.
const DEPLOY_HOOK = process.env.RENDER_DEPLOY_HOOK_URL;
const DEBOUNCE_MS = 90_000;

let timer = null;
const pendingTags = new Set();

export async function revalidateTag(tag) {
  if (!DEPLOY_HOOK) {
    console.error("revalidateTag skipped: RENDER_DEPLOY_HOOK_URL not set");
    return;
  }

  pendingTags.add(tag);
  clearTimeout(timer);

  timer = setTimeout(async () => {
    const tags = [...pendingTags].join(", ");
    pendingTags.clear();
    timer = null;
    try {
      const res = await fetch(DEPLOY_HOOK, { method: "POST" });
      console.log(`Static site rebuild requested (${tags}) -> HTTP ${res.status}`);
    } catch (err) {
      // Best-effort: worst case the next edit (or a manual deploy) rebuilds it.
      console.error("Static site rebuild request failed:", err.message);
    }
  }, DEBOUNCE_MS);
}
