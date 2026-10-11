# Deploying BSMA on Render: Static Site + API

```
 Visitor ──► Render Static Site (apps/web/out)   always on, CDN, free
                │  (forms, admin login)
                ▼
             Render Web Service (apps/api)       sleeps when idle (free)  ──► Neon + Cloudinary
                │
                └─ after an admin edit: POST to the Static Site's Deploy Hook → rebuild (~2-4 min)
```

The public site is pre-built into plain HTML. Visitors never wait for the API:
Render's generic "spinning up" page can no longer appear, and Neon's cold start
can no longer blank a page. Only forms and the admin panel talk to the API.

## How content reaches the site
Admin saves/publishes → API waits 90 s with no further edit → calls the Deploy
Hook → Render rebuilds the site (wakes the API + Neon first, see
`apps/web/scripts/wait-for-api.mjs`) → new HTML goes live. **Edits appear after
about 2-4 minutes, not instantly.** If the API/DB can't be reached during a build,
the build FAILS and the previous version stays online (it never publishes an empty site).

## Setup order
1. **Branch**: work on a branch (e.g. `static-site`) so `main` and the old services keep working.
2. **API service** (`bsma-api`, Docker, `./apps/api/Dockerfile`, context `.`): keep its existing env
   vars and set `CLIENT_URL` = the static site URL (exact, `https://…`, no trailing slash).
   `REVALIDATE_SECRET` is no longer used. Add `RENDER_DEPLOY_HOOK_URL` (step 4).
3. **Static Site** (New → Static Site):
   - Branch: `static-site` (switch to `main` at cut-over). Root Directory: *(empty)*.
   - Build Command:
     `npm ci --workspace=apps/web --workspace=packages/shared --include-workspace-root && npm run build:static --workspace=apps/web`
   - Publish Directory: `apps/web/out`
   - Env vars: `NODE_VERSION=20`, `NEXT_PUBLIC_API_URL=https://<api>.onrender.com/api`,
     `NEXT_PUBLIC_SITE_URL=<this site's public URL>`, `NEXT_PUBLIC_GA_ID=<yours>`.
     (These are baked in at build time: change one → redeploy.)
4. **Deploy Hook**: Static Site → Settings → Deploy Hook → copy the URL → paste it in the API's
   `RENDER_DEPLOY_HOOK_URL`.

## Verify before cut-over
Home, About, Projects (category tabs, and `/projects/?category=…` opened directly), a project page,
Contact + Devis (send one; check the email), an unknown URL (404 page), `/about` **without** trailing
slash, admin login, an edit + publish (a build should start ~90 s later), and the first visit after
20+ minutes idle (public pages instant; admin shows the branded loader while the API wakes).

## Troubleshooting
- Build log says `API did not wake up in time`: the API is down or `NEXT_PUBLIC_API_URL` is wrong. Fix and redeploy.
- Browser console shows a CORS error on forms/admin: `CLIENT_URL` on the API ≠ the site URL.
- Admin login works in Chrome but not Safari/iPhone: browsers block cookies between two
  `*.onrender.com` hosts. Put both behind one custom domain (`www.` + `api.`) and it disappears.
- `/about` (no slash) 404s: add Redirect rules `/about → /about/` (same for contact, devis, projects) in the static site's settings.

## Known limits
Edits are live after a rebuild (2-4 min); a brand-new project's page doesn't exist until that rebuild
finishes; builds count against Render's monthly pipeline-minutes allowance (Billing → Usage).
