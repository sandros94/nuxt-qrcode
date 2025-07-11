# Dockerfile with PNPM for Nuxt - v1.2.2
# https://gist.github.com/sandros94/03675514546f17af1fd6db3863c043b4

# Base configuration
ARG node_tag=22-alpine
FROM node:${node_tag} AS base
WORKDIR /app

# Builder
FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc /app/
COPY /docs/package.json /app/docs/
COPY /playground/package.json /app/playground/
RUN npm i -g --force corepack && corepack enable

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --shamefully-hoist

ARG NUXT_UI_PRO_LICENSE

COPY . .
RUN --mount=type=cache,id=nuxt,target=/app/node_modules/.cache/nuxt/.nuxt \
    pnpm run dev:prepare && pnpm run docs:build

EXPOSE 3000
HEALTHCHECK  --retries=10 --start-period=5s \
  CMD wget --no-verbose --spider http://0.0.0.0:3000/ || exit 1

ENTRYPOINT [ "node", "./docs/.output/server/index.mjs" ]
