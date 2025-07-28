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

# Copy the entire workspace structure to maintain lockfile compatibility
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY libs/dtos/package.json ./libs/dtos/package.json

# Copy Prisma schema for client generation
COPY apps/api/src/prisma ./apps/api/src/prisma

# Install production dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Generate Prisma client in production
RUN pnpm --filter api prisma generate --schema=apps/api/src/prisma/schema.prisma

# Clean up dev dependencies after generating Prisma client
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts
COPY --from=builder /app/libs/dtos ./libs/dtos
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

EXPOSE 4000
CMD ["node", "dist/main.js"]