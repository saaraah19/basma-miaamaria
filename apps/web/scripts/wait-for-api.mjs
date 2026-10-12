// Runs before `next build` on Render. The API (and its Neon database) sleep on
// the free plan, so wake them and wait until they really answer — otherwise the
// build would start while they're asleep and fail, or bake an empty site.
//
// Two stages, because they fail in different ways:
//   1. GET /api/health        -> the API process is awake (never touches the DB)
//   2. GET /api/content/navbar -> the database is awake too (this is the call the
//                                  real build makes, so if it works here it works there)
//
// "Still waking up" (timeouts, 5xx) is retried. A 404/401/403 is NOT waking up:
// it means the address is wrong, so we stop after a few tries and say why,
// instead of looping for minutes. Any failure exits 1: the build stops and
// Render keeps serving the previous good version.
const MAX_WAIT_MS = Number(process.env.WAIT_FOR_API_MAX_MS) || 5 * 60_000;
const RETRY_MS = Number(process.env.WAIT_FOR_API_RETRY_MS) || 5_000;
const CONFIG_ERRORS_BEFORE_ABORT = 3;
const deadline = Date.now() + MAX_WAIT_MS;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fail(message) {
  console.error(`\n[wait-for-api] ABORTING: ${message}`);
  console.error("[wait-for-api] The build stops here on purpose; the previous version of the site stays online.\n");
  process.exit(1);
}

// ── 1. Validate the variable exactly as `next build` will use it ────────────
// (NEXT_PUBLIC_* values are baked in verbatim, so we must NOT silently "fix"
//  them here: a stray space or slash would still break the real build.)
const raw = process.env.NEXT_PUBLIC_API_URL;
if (!raw) fail("NEXT_PUBLIC_API_URL is not set on this Static Site (Environment tab).");

console.log(`[wait-for-api] NEXT_PUBLIC_API_URL = ${JSON.stringify(raw)}`);
const cleaned = raw.trim().replace(/^["']+|["']+$/g, "").replace(/\/+$/, "");
if (raw !== cleaned) {
  fail(`NEXT_PUBLIC_API_URL contains stray spaces, quotes or a trailing slash. Set it to exactly: ${cleaned}`);
}
if (!/^https?:\/\/[^/]+(\/.*)?\/api$/.test(raw)) {
  fail(`NEXT_PUBLIC_API_URL must be the full API address ending in /api, e.g. https://your-api.onrender.com/api (got ${JSON.stringify(raw)}).`);
}

// ── 2. One request, fully logged ────────────────────────────────────────────
async function probe(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(70_000),
      headers: { accept: "application/json" },
    });
    const body = await res.text();
    const routing = res.headers.get("x-render-routing");
    const detail = res.ok ? "" : `  body: ${body.slice(0, 140).replace(/\s+/g, " ")}`;
    console.log(
      `[wait-for-api]   GET ${url} -> ${res.status} in ${Date.now() - started} ms` +
        `${routing ? ` (x-render-routing: ${routing})` : ""}${detail}`
    );
    return { status: res.status, body, routing };
  } catch (err) {
    console.log(
      `[wait-for-api]   GET ${url} -> no response (${err.cause?.code || err.message}) after ${Date.now() - started} ms`
    );
    return { status: 0, body: "", routing: null };
  }
}

function explainWrongAddress(url, r) {
  if (r.routing && /no-server|no-deploy/i.test(r.routing)) {
    return `Render itself answered ${r.status} (x-render-routing: ${r.routing}): no running service is reachable at ${url}. The API service is suspended or deleted, or the host in NEXT_PUBLIC_API_URL is wrong.`;
  }
  if (/Route introuvable/i.test(r.body)) {
    return `The API is awake but has no route at ${url}. The path in NEXT_PUBLIC_API_URL is wrong (it must end in /api).`;
  }
  return `${url} answered ${r.status}, but not like your API does (body: ${r.body.slice(0, 100).replace(/\s+/g, " ")}). Check that NEXT_PUBLIC_API_URL points at the API service, not at this static site or another service.`;
}

async function waitFor(label, url, isReady) {
  console.log(`[wait-for-api] ${label}`);
  let wrongAddress = 0;
  while (Date.now() < deadline) {
    const r = await probe(url);
    if (r.status === 200 && isReady(r.body)) return;
    if ([401, 403, 404].includes(r.status)) {
      if (++wrongAddress >= CONFIG_ERRORS_BEFORE_ABORT) fail(explainWrongAddress(url, r));
    } else {
      wrongAddress = 0; // sleeping / waking up: keep waiting
    }
    await sleep(RETRY_MS);
  }
  fail(`${label}: no valid answer within ${Math.round(MAX_WAIT_MS / 1000)} s.`);
}

const isJson = (body) => {
  try { JSON.parse(body); return true; } catch { return false; }
};

await waitFor("Stage 1/2: is the API awake?", `${raw}/health`, (b) => isJson(b) && JSON.parse(b).status === "ok");
await waitFor("Stage 2/2: is the database awake? (same call the build makes)", `${raw}/content/navbar`, isJson);

console.log("[wait-for-api] API and database are ready. Starting the build.");
