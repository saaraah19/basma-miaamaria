# Build context must be the repo root (npm workspaces monorepo):
#   docker build -f apps/web/Dockerfile -t bsma-web .
# docker-compose.yml already sets this up.
#
# Requires next.config.js to set `output: "standalone"`.
#
# NOTE: in this monorepo, Next's file tracer uses the workspace root as its
# tracing root, so the standalone output is flattened directly into
# .next/standalone/ (server.js, .next/, package.json, node_modules) instead
# of being nested under apps/web/. The COPY destinations below reflect that.

FROM node:20-alpine AS base
WORKDIR /app

# ---- deps ----------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --workspace=apps/web --workspace=packages/shared --include-workspace-root

# ---- build ----------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY packages/shared packages/shared
COPY apps/web apps/web

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace=apps/web

# ---- runtime ----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Standalone output is flattened to the workspace root in this monorepo —
# server.js, .next/, package.json, and node_modules all land directly here.
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
