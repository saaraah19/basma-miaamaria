# BSMA — Plateforme Portfolio & Administration

Site web professionnel pour **Basma Miamaria**, cabinet d'architecture et de
décoration intérieure basé à Oran, Algérie. La plateforme combine un site
vitrine public et un panneau d'administration permettant une gestion
autonome du contenu, des projets et des demandes clients.

## À propos

Le site présente les projets, services et l'identité du cabinet, tout en
offrant une interface d'administration complète permettant de modifier
textes, couleurs, polices, catégories de projets et galeries d'images sans
intervention technique.

## Stack technique

Le projet est organisé en monorepo (npm workspaces) :

```
apps/api/       API REST — Express, Prisma, PostgreSQL
apps/web/       Application web — Next.js (App Router)
packages/shared Schémas de validation partagés (Zod)
```

**Frontend**
- Next.js (App Router) — rendu serveur pour le site public, interface
  client pour l'administration
- Tailwind CSS pour le style
- Tiptap comme éditeur de texte enrichi
- React Query pour la gestion des données côté admin
- dnd-kit pour le réordonnancement par glisser-déposer

**Backend**
- Express.js
- Prisma ORM avec PostgreSQL
- Validation partagée via Zod (mêmes schémas côté client et serveur)

**Services externes**
- Cloudinary — hébergement et optimisation des images
- Resend — envoi d'emails transactionnels (formulaires de contact et devis)

## Fonctionnalités principales

- Site vitrine avec pages Accueil, À propos, Projets, Contact, Devis
- Portfolio de projets avec catégories dynamiques, galerie d'images et
  filtres publics
- Formulaires de contact et de demande de devis avec notifications par
  email
- Panneau d'administration pour la gestion du contenu textuel, des
  couleurs, des projets, des services, des médias et des messages reçus
- Optimisation des images (Cloudinary) et mise en cache incrémentale (ISR)
  avec revalidation automatique après chaque modification
- Design responsive avec thème clair/sombre

## Prérequis

- Node.js 20 ou supérieur
- Une base de données PostgreSQL
- Un compte Cloudinary (hébergement d'images)
- Un compte Resend (envoi d'emails)

## Installation

```bash
npm install
```

Chaque application (`apps/api`, `apps/web`) nécessite son propre fichier de
configuration d'environnement, basé sur les fichiers `.env.example` fournis
dans chaque dossier. Les valeurs de connexion à la base de données, les
clés de services externes et les paramètres du site doivent y être
renseignés avant le démarrage.

```bash
npm run db:migrate
npm run db:seed

npm run dev:api
npm run dev:web
```

## Déploiement

Le projet est conteneurisé (Docker) pour les deux applications, ce qui
permet un déploiement sur tout hébergeur supportant des conteneurs Docker.
La configuration de production nécessite des valeurs d'environnement
propres à l'hébergement choisi (URL du site, connexion à la base de
données, clés de services tiers).

## Structure de la validation

L'ensemble des règles de validation (formulaires, contenu éditable,
projets, services) est centralisé dans `packages/shared`, garantissant une
cohérence stricte entre ce que l'interface accepte et ce que l'API valide.

---

*Projet développé sur mesure pour Basma Miamaria.*
