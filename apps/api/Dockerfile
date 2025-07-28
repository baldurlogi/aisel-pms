# ───── STAGE 1: install deps & generate Prisma client ─────
FROM node:20-alpine AS deps

# enable pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app

# copy only the files needed to install
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

# install everything (monorepo fashion)
RUN pnpm install --frozen-lockfile

# copy your Prisma schema and generate client
COPY apps/api/src/prisma ./apps/api/src/prisma
RUN pnpm --filter api prisma generate \
      --schema=apps/api/src/prisma/schema.prisma


# ───── STAGE 2: build your NestJS app ─────
FROM deps AS builder

WORKDIR /app

# copy the rest of your code (src, libs, etc)
COPY . .

# build the API
WORKDIR /app/apps/api
RUN pnpm build


# ───── STAGE 3: production image ─────
FROM node:20-alpine AS production

# enable pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app

# pull in only the built files + prod deps
COPY --from=builder /app/apps/api/dist    ./dist
COPY --from=deps    /app/node_modules     ./node_modules

EXPOSE 4000
CMD ["node", "dist/main.js"]