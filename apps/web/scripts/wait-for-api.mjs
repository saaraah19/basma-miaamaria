// Runs before `next build` on Render. The API (and its Neon database) sleep on
// the free plan, so wake them and wait until they really answer. Otherwise the
// build would start while they're still asleep and fail (or worse, bake an
// empty site). If they never wake, we exit 1: the build fails and Render keeps
// serving the previous good version.
const base = process.env.NEXT_PUBLIC_API_URL;
if (!base) {
  console.error("[wait-for-api] NEXT_PUBLIC_API_URL is not set.");
  process.exit(1);
}

const url = `${base}/content/navbar`; // touches the database, so it wakes Neon too
const deadline = Date.now() + 5 * 60_000;
let attempt = 0;

while (Date.now() < deadline) {
  attempt++;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(70_000) });
    if (res.ok) {
      await res.json();
      console.log(`[wait-for-api] API ready (attempt ${attempt}).`);
      process.exit(0);
    }
    console.log(`[wait-for-api] attempt ${attempt}: HTTP ${res.status}, retrying...`);
  } catch (err) {
    console.log(`[wait-for-api] attempt ${attempt}: ${err.message}, retrying...`);
  }
  await new Promise((r) => setTimeout(r, 5000));
}

console.error("[wait-for-api] API did not wake up in time. Aborting; the previous site stays live.");
process.exit(1);
