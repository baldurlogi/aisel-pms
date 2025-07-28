# ───── STAGE 1: Install deps & generate Prisma client ─────
FROM node:20.17.0-alpine3.18 AS deps

# 1) Enable pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app

# 2) Copy lockfiles and workspace manifest
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# 3) Copy only your API’s package.json to scope the install
COPY apps/api/package.json ./apps/api/package.json

# 4) Install all deps (monorepo-aware)
RUN pnpm install --frozen-lockfile

# 5) Copy in your Prisma schema and generate the client
COPY apps/api/src/prisma ./apps/api/src/prisma
RUN pnpm --filter api prisma generate \
    --schema=apps/api/src/prisma/schema.prisma


# ───── STAGE 2: Build your NestJS API ─────
FROM deps AS builder

WORKDIR /app

# Copy the rest of your repo (source code, libs, etc)
COPY . .

# Move into the API package and build it
WORKDIR /app/apps/api
RUN pnpm build


# ───── STAGE 3: Production image ─────
FROM node:20.17.0-alpine3.18 AS production

# 1) Enable pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app

# 2) Copy only what we need from previous stages
COPY --from=builder /app/apps/api/dist    ./dist
COPY --from=deps    /app/node_modules     ./node_modules

# 3) Expose your API port
EXPOSE 4000
CMD ["node", "dist/main.js"]