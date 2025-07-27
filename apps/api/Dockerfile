# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy monorepo workspace files first
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY .env ./

# Copy all package.json files to understand the full dependency tree
COPY package.json* ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

# Install all dependencies using pnpm (supports monorepo)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code (dockerignore will exclude unwanted files)
# This includes any libs/ folder and other shared code
COPY . .

# Generate Prisma client from root (monorepo style)
RUN pnpm --filter api prisma generate --schema=apps/api/src/prisma/schema.prisma

# Move to API directory for building
WORKDIR /app/apps/api

# Build the NestJS project
RUN pnpm build


# ---------- STAGE 2: Runtime ----------
FROM node:20-alpine AS production

ENV NODE_ENV=production

# Enable pnpm
# Enable pnpm and install required build tools + openssl
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && apk add --no-cache make g++ python3 openssl

WORKDIR /app

# Copy monorepo files
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY .env ./

# Copy all package.json files
COPY package.json* ./
COPY apps/api/package.json ./apps/api/package.json

# Install ALL dependencies (including dev) to have Prisma CLI available
RUN pnpm install --frozen-lockfile

# Switch to API directory
WORKDIR /app/apps/api

# Copy build artifacts
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/src/prisma ./src/prisma

# Generate Prisma client directly in production stage
RUN cd /app && pnpm --filter api prisma generate --schema=apps/api/src/prisma/schema.prisma

# Clean up dev dependencies to reduce image size
RUN pnpm install --prod --frozen-lockfile

EXPOSE 4000
CMD ["node", "dist/apps/api/src/main.js"]