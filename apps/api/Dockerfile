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

WORKDIR /app

# 1) Copy your tsconfig so tsconfig-paths can read paths
COPY apps/api/tsconfig.json ./tsconfig.json

# 2) Bring in the full root node_modules (hoisted deps + Prisma client + Nest packages)
COPY --from=deps /app/node_modules ./node_modules

# 3) (Optional) If you still need your DTOs at runtime
COPY --from=builder /app/libs/dtos      ./node_modules/libs/dtos

# 4) Copy your compiled API
COPY --from=builder /app/apps/api/dist  ./dist


EXPOSE 4000
CMD ["node", "dist/main.js"]