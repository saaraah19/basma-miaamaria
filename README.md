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



*Project custom-built for Basma Miamaria.*
