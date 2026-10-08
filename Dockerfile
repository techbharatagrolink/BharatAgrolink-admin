# Production image for the admin panel (deployed on Dokploy, Build Type: Dockerfile).
#
# The API address is read at runtime: set NEXT_PUBLIC_API_URL (or API_URL) and
# NEXT_PUBLIC_SITE_URL in Dokploy's Environment. No build arguments are needed.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
# No API / site URL here on purpose: the server code reads them at runtime, so a
# build-time default would only risk pointing the image at localhost.
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
