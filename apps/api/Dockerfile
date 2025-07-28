# ───── STAGE 1: install deps & generate Prisma client ─────
FROM node:20-alpine AS deps

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# copy only the entire repo
WORKDIR /app
COPY . .

# install everything (monorepo fashion)
RUN pnpm install --frozen-lockfile

# copy your Prisma schema and generate client
RUN pnpm --filter api prisma generate --schema=apps/api/src/prisma/schema.prisma


# ───── STAGE 2: build your NestJS app ─────
FROM deps AS builder

WORKDIR /app
RUN pnpm --filter dtos build

WORKDIR /app/apps/api
RUN pnpm build


# ───── STAGE 3: production image ─────
FROM node:20-alpine AS production

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/apps/api

# 1) Copy only the API’s package.json & lockfile, so we can install just its prod deps
COPY apps/api/package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# 2) Install production deps _inside_ apps/api/node_modules
RUN pnpm install --prod --frozen-lockfile

# 3) Copy in your DTO library (if your code imports "libs/dtos" at runtime)
COPY --from=builder /app/libs/dtos ./node_modules/libs/dtos

# 4) Copy the compiled output
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 4000
CMD ["node", "dist/main.js"]