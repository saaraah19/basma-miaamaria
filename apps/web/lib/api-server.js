const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    next: { tags, revalidate },
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
