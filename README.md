# BSMA — Basma Miamaria Architecture Platform (v2)

Rebuilt for production. Monorepo with npm workspaces:

```
apps/api/       Express + Prisma + Postgres — REST API, hardened auth, Cloudinary uploads
apps/web/       Next.js (App Router) — public site (SSR/ISR) + admin panel (client-rendered)
packages/shared Zod schemas used by BOTH apps — one source of truth for validation
```

## Why this shape

- **One Next.js app**, not a separate SPA for admin. Public routes are Server
  Components (real HTML on first byte, per-page metadata, fast LCP — this is
  what fixes the SEO gaps from the audit). Admin routes are Client Components
  in the same app, so both share the API client, UI primitives, and the
  `@bsma/shared` validation schemas instead of duplicating them.
- **`packages/shared`** exists specifically so a value can never be "valid
  enough for the form but not for the database," or vice versa. Both the
  admin UI and the Express controller import the exact same zod schema.
- **Auth moved to an httpOnly cookie.** The JWT is no longer readable by
  JavaScript (so an XSS payload can't exfiltrate it via `localStorage`),
  and content is now sanitized *server-side, on write* — not just on
  render — which closes the stored-XSS path that existed in the original
  app's rich-text editor.

## Setup

```bash
# from repo root
npm install                       # installs all three workspaces at once

cp apps/api/.env.example apps/api/.env
# fill in DATABASE_URL, JWT_SECRET, Cloudinary + Resend keys

npm run db:migrate                # runs prisma migrate dev (apps/api)
npm run db:seed                   # seeds the DB + creates the admin user

npm run dev:api                   # http://localhost:5000
npm run dev:web                   # http://localhost:3000 (once apps/web exists)
```

Default seeded admin: `admin@bsma.com` / `admin123` — **change this password
immediately** via a real change-password flow before going to production;
it's not yet built (see progress tracker below).

## Build progress

- [x] Workspace skeleton (npm workspaces, root package.json, .gitignore)
- [x] `packages/shared` — zod schemas: project, service, content (+ typed
      block registry), forms, auth
- [x] `apps/api` — hardened:
  - [x] Cookie-based auth (httpOnly, Secure in prod, SameSite=Strict)
  - [x] Dedicated login rate limiter (5/15min) + global limiter (300/15min)
        + forms limiter (10/15min)
  - [x] Generic zod `validate()` middleware on every mutating route
  - [x] Content sanitized server-side on write via a typed
        section/key registry (no more freeform HTML trust)
  - [x] File upload: real mimetype filter + 8MB size limit + wrapped
        error handling (was previously unguarded)
  - [x] Project slugs for real SEO-friendly URLs (`/projects/[slug]`)
  - [x] Image reorder ownership check (was a latent BOLA/IDOR gap)
  - [x] Explicit CSP (was relying on helmet defaults)
  - [x] HTML-escaped email templates (was raw string interpolation)
- [ ] `apps/api` — change-password endpoint, refresh-token rotation
- [x] `apps/web` — Next.js scaffold, root layout, JSON-LD, Navbar/Footer
      (Server Components, theme toggle isolated as the only client island)
- [x] `apps/web` — Home page: Hero, Services, Projects (preview), Contact —
      all Server Components fetching directly from the API, real per-page
      metadata, Cloudinary responsive images, LCP preload on the hero image
- [x] `apps/web` — `lib/blockStyles.js`: maps validated style tokens
      (color/align/weight) to real CSS — replaces the old raw-style-object
      spread that would have broken now that `styles` is a safe enum, not
      free-form CSS
- [x] `apps/web` — Projects listing (`/projects`, URL-based category filter,
      no client JS needed) + Project detail (`/projects/[slug]`, dynamic
      `generateMetadata()` per project, OG image from the cover photo,
      real `notFound()` → 404 page)
- [x] `apps/web` — image gallery (client island wrapping Swiper; the main
      slide uses `next/image` with `fill` for proper optimization, thumbs
      use a lightweight plain `<img>` since next/image overhead isn't
      worth it at 160px)
- [x] `apps/web` — 404 page inside the `(public)` group (keeps Navbar/Footer),
      back button isolated as its own tiny client component
- [x] `apps/web` — About page (parses valeurs/expertise JSON lists with a
      safe fallback; fixed a dead CTA button from the original — it was a
      `<button>` with no `onClick`, now a real link to `/devis`)
- [x] `apps/web` — Contact page (hero + info column + shared `ContactForm`)
      and Devis page (dedicated `DevisForm` with the project-type select)
- [x] `apps/web` — `sitemap.js` (dynamic, queries live projects) + `robots.js`
      (disallows `/admin`)
- [x] `apps/web` — admin auth foundation:
  - [x] `QueryProvider` (React Query client boundary, devtools in dev only)
  - [x] `lib/auth-client.js` — `useSession()`/`useLogin()`/`useLogout()`,
        session state comes from `GET /api/auth/me`, never from a token
        the client can read directly
  - [x] Login page (cookie-based, redirects to `?from=` target on success)
  - [x] `AdminLayout` — sidebar/topbar shell, **also client-side redirects
        to login if the session cookie is present but expired/invalid**
        (middleware.js only checks cookie *presence*, not validity — this
        closes that gap)
  - [x] Dashboard page (stats + quick actions)
- [x] `apps/api` — fixed a real bug carried over from the original: the
      admin project list was hitting the *public* `getProjects` endpoint,
      which only returns `isVisible: true` — meaning a hidden/draft project
      was invisible in the admin table too, with no way to manage it back
      to visible. Added a dedicated protected `GET /projects/admin/all`.
- [x] `apps/web` — ProjectManager, fully built:
  - [x] Table with expandable inline image panel (no navigating away to
        manage a project's images)
  - [x] `ProjectForm` — validates client-side against the exact same
        `projectCreateSchema` from `@bsma/shared` that the API enforces,
        so a rejected submission is never a surprise
  - [x] `ImageUploader` — drag-and-drop reorder (dnd-kit), cover selection,
        client-side file type/size validation mirroring the API's actual
        limits (JPG/PNG/WEBP, 8MB) so bad files are rejected before a
        wasted upload attempt, not after
  - [x] Shared `ConfirmModal` (also used by ServicesEditor/MediaManager next)
- [x] `apps/web` — ContentEditor, fully split (biggest file is now ~90
      lines, vs. the original's single 500-line file):
  - [x] `TextBlockEditor` — the one reusable field editor every section
        composes, renders differently per registered type (richText →
        Tiptap, plainText → textarea, url → validated input)
  - [x] **Consistency fix**: dropped Tiptap's color-picker/text-align
        extensions from the rich-text toolbar. Both write inline
        `style="..."` attributes, which the server's sanitizer strips
        completely (by design — no raw CSS from rich text). Keeping them
        would have meant a color/alignment choice silently vanishing on
        save. Block-level color/alignment is handled by the separate
        `StyleControls` (enum-based, matches `blockStylesSchema` exactly)
  - [x] `StyleControls` — the safe alternative to a CSS field
  - [x] `ListFieldEditor` — generic repeatable-list editor for the
        valeurs/expertise JSON fields, validated against the exact schemas
        the API enforces
  - [x] `HeroBgEditor` — uploads through the media endpoint, writes the
        resulting Cloudinary URL into the `bg_image` content block
  - [x] `IconPicker` — searchable react-icons grid, ported from the original
  - [x] `ServicesEditor` — validates against `serviceSchema`
  - [x] 9 section files (Hero/Home/About/Services/Contact/Navbar/Footer/
        ContactPage/Devis), tab bar in the page shell
- [x] `apps/web` — MediaManager: upload with the same client-side
      validation pattern as ImageUploader, grid view, copy-URL, delete
      (all via the shared `ConfirmModal`)

## Status: feature-complete

Every planned piece is built: the full public site (SSR/ISR, real
per-page SEO, dynamic sitemap), the hardened API (cookie auth, sanitize-
on-write, validated everything), and the full admin panel (dashboard,
project CRUD with drag-and-drop images, the split content editor, services,
media library).

## Before this goes to production

- [ ] Change-password flow (the seeded `admin123` password needs a real
      way to be changed — right now that requires a direct DB update)
- [ ] Refresh-token rotation (nice-to-have; the current 2h session expiry
      with re-login is a reasonable v1, but longer sessions would want this)
- [ ] Real Cloudinary/Postgres/Resend credentials in both `.env` files
      (see `.env.example` in each app)
- [ ] `npm install` at the root, `npm run db:migrate`, `npm run db:seed`
- [ ] Change the seeded admin password immediately after first login
- [ ] Point `NEXT_PUBLIC_SITE_URL` / `CLIENT_URL` at the real production
      domain before deploying (affects CORS, cookies, sitemap, JSON-LD)
- [ ] Verify Cloudinary account limits (free tier: 25GB storage/bandwidth)
      are adequate for the client's expected image volume

**All public marketing pages are now complete**: Home, About, Projects
(listing + detail), Contact, Devis, 404, sitemap, robots. The admin panel
is the only remaining major piece.

## What changed vs. the original app (quick reference)

| Area | Before | Now |
|---|---|---|
| Auth token | `localStorage`, `Authorization` header | httpOnly cookie, `SameSite=Strict` |
| Content writes | Trusted raw HTML from client | Sanitized server-side against a typed registry |
| File uploads | No mimetype/size check | `fileFilter` + 8MB limit + clean error responses |
| Project URLs | `/projects/cjld2cyuq...` (cuid) | `/projects/maison-contemporaine-x7k2p9` |
| Validation | None (trusted `req.body`) | zod on every mutating route, shared with the frontend |
| Login rate limit | Shared 100/15min limiter | Dedicated 5/15min limiter |
| Image reorder | No ownership check | Verifies every image id belongs to the target project |
