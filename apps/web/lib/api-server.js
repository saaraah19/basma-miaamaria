// The public site is a static export: every call below runs ONCE, while
// `next build` generates the pages — never when a visitor opens the site.
//
// Safety net: if the API is unreachable (it sleeps on Render's free plan),
// the pages' own `.catch(() => defaults)` would silently bake an EMPTY site.
// So during the build we retry, and if the API still doesn't answer we abort
// the build. A failed build never replaces the live site — the previous good
// version simply stays online.
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const TIMEOUT_MS = 60_000;
const ATTEMPTS = 3;

// `tags` / `revalidate` are kept in the signature so callers don't change,
// but there is no runtime cache anymore: a content change triggers a rebuild.
async function apiFetch(path, { tags: _tags, revalidate: _revalidate, ...init } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        ...init,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (res.ok) return res.json();

      const error = new Error(`API request failed: ${res.status} ${path}`);
      error.status = res.status;
      if (res.status < 500) throw error; // 404 etc.: a real answer, no retry
      lastError = error;
    } catch (err) {
      if (err.status && err.status < 500) throw err;
      lastError = err;
    }
  }

  if (IS_BUILD) {
    console.error(
      `\n[api-server] FATAL: ${path} unreachable after ${ATTEMPTS} attempts ` +
        `(${lastError?.message}). Aborting the build so the previous good ` +
        `version of the site stays live.\n`
    );
    process.exit(1);
  }
  throw lastError;
}

export const getSection = (section) =>
  apiFetch(`/content/${section}`, { tags: [`content:${section}`] });

export const getProjects = () => apiFetch("/projects", { tags: ["projects"] });

export const getProject = (idOrSlug) =>
  apiFetch(`/projects/${idOrSlug}`, { tags: ["projects", `project:${idOrSlug}`] });

export const getServices = () => apiFetch("/services", { tags: ["services"] });

export const getCategories = () => apiFetch("/categories", { tags: ["categories"] });
