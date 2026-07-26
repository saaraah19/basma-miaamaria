# Build context must be the repo root (npm workspaces monorepo):
#   docker build -f apps/api/Dockerfile -t bsma-api .
# docker-compose.yml already sets this up.

FROM node:20-alpine AS base
WORKDIR /app

# ---- deps ----------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --workspace=apps/api --workspace=packages/shared --include-workspace-root

# ---- build (prisma client generation) -------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# ---- runtime ----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app ./
WORKDIR /app/apps/api

EXPOSE 5000
CMD ["node", "src/index.js"]
