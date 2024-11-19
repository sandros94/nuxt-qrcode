# Dockerfile with PNPM+Bun - v1.0.0
# https://gist.github.com/sandros94/03675514546f17af1fd6db3863c043b4

# Build container
FROM node:20-alpine AS builder

# Enable Corepack
RUN corepack enable

# Cartella della webapp
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch --shamefully-hoist

ENV NUXT_UI_PRO_LICENSE=""

# Build production
COPY . ./
RUN pnpm install --offline && pnpm run dev:prepare && pnpm run docs:build

# Final production container
FROM oven/bun:alpine AS runtime

USER bun

WORKDIR /app

COPY --link --from=builder /usr/src/app/docs/.output/  ./.output
COPY --link --from=builder /usr/src/app/docs/content/  ./content

EXPOSE 3000

HEALTHCHECK  --retries=10 --start-period=5s \
  CMD wget --no-verbose --spider http://0.0.0.0:3000/ || exit 1

ENTRYPOINT [ "bun", "run", ".output/server/index.mjs" ]
