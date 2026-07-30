# BASMA MIAAMARIA — Portfolio & Admin Platform

Professional website for **Basma Miamaria**, an architecture and interior
design studio based in Oran, Algeria. The platform combines a public
showcase site with an admin panel enabling independent management of
content, projects, and client requests.

## About

The site presents the studio's projects, services, and identity, while
offering a full admin interface to edit text, colors, fonts, project
categories, and image galleries without any technical intervention.

## Tech stack

The project is organized as a monorepo (npm workspaces):

```
apps/api/       REST API — Express, Prisma, PostgreSQL
apps/web/       Web application — Next.js (App Router)
packages/shared Shared validation schemas (Zod)
```

**Frontend**
- Next.js (App Router) — server-rendered public site, client-rendered
  admin interface
- Tailwind CSS for styling
- Tiptap as the rich-text editor
- React Query for admin-side data fetching
- dnd-kit for drag-and-drop reordering

**Backend**
- Express.js
- Prisma ORM with PostgreSQL
- Shared validation via Zod (same schemas on both client and server)

**External services**
- Cloudinary — image hosting and optimization
- Resend — transactional email delivery (contact and quote request forms)

## Key features

- Public site with Home, About, Projects, Contact, and Quote Request pages
- Project portfolio with dynamic categories, image galleries, and public
  filters
- Contact and quote request forms with email notifications
- Admin panel for managing text content, colors, projects, services,
  media, and incoming messages
- Image optimization (Cloudinary) and incremental static caching (ISR)
  with automatic revalidation after each update
- Responsive design with light/dark theme

## Requirements

- Node.js 20 or higher
- A PostgreSQL database
- A Cloudinary account (image hosting)
- A Resend account (email delivery)

## Installation

```bash
npm install
```

Each application (`apps/api`, `apps/web`) requires its own environment
configuration file, based on the `.env.example` files provided in each
folder. Database connection values, third-party service keys, and site
settings must be filled in before startup.

```bash
npm run db:migrate
npm run db:seed

npm run dev:api
npm run dev:web
```

## Deployment

The project is containerized (Docker) for both applications, enabling
deployment on any hosting provider that supports Docker containers.
Production configuration requires environment values specific to the
chosen host (site URL, database connection, third-party service keys).

## Validation structure

All validation rules (forms, editable content, projects, services) are
centralized in `packages/shared`, ensuring strict consistency between
what the interface accepts and what the API validates.

---

*Project custom-built for Basma Miamaria.*
