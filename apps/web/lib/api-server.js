// Runs inside the same container as the Express API now (see
// Dockerfile.combined), so it calls it directly over localhost instead
// of going out to the public domain and back in through the Next.js
// rewrite in next.config.js — same destination, one less network hop.
// Falls back to NEXT_PUBLIC_API_URL so this file still works unchanged
// in local dev (`npm run dev:web` + `npm run dev:api` as two processes).
const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

/**
 * Thin wrapper around fetch for use inside Server Components / route
 * handlers. Every call is tagged so an admin mutation can call
 * `revalidateTag("projects")` and the public pages reflect the edit on
 * next request — no waiting for the next full rebuild, no client-side
 * loading spinners on marketing pages.
 *
 * `revalidate` defaults to 60s as a safety net even without an explicit
 * tag-based revalidation call.
 */
async function apiFetch(path, { tags = [], revalidate = 60, ...init } = {}) {
  // A hard timeout so a slow/unreachable API fails fast instead of hanging.
  // This matters most during `next build`'s static-generation pass, where
  // nothing may be listening yet — a fetch that just hangs there blows
  // past Next's own 60s page-build limit and fails the whole deploy,
  // instead of hitting the .catch() fallback each caller already has.
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    next: { tags, revalidate },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    // Let callers decide how to handle 404 vs 500 — surfacing the status
    // means a page can render its own notFound() instead of a generic error.
    const error = new Error(`API request failed: ${res.status} ${path}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export const getSection = (section) =>
  apiFetch(`/content/${section}`, { tags: [`content:${section}`] });

export const getProjects = () => apiFetch("/projects", { tags: ["projects"] });

export const getProject = (idOrSlug) =>
  apiFetch(`/projects/${idOrSlug}`, { tags: ["projects", `project:${idOrSlug}`] });

export const getServices = () => apiFetch("/services", { tags: ["services"] });

export const getCategories = () => apiFetch("/categories", { tags: ["categories"] });
