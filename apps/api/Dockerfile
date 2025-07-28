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

RUN apk add --no-cache openssl libc6-compat

# enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the entire workspace structure to maintain lockfile compatibility
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY libs ./libs

# Install production dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Generate Prisma client in production
RUN pnpm --filter api prisma generate --schema=apps/api/src/prisma/schema.prisma

# Clean up dev dependencies after generating Prisma client
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts
COPY --from=builder /app/libs/dtos ./libs/dtos
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/libs/dtos ./dist/libs/dtos

# Copy and make start script executable
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 4000
CMD ["./start.sh"]
