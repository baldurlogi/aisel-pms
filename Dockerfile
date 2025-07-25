# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS builder

ENV HUSKY=0

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY apps/api/nest-cli.json ./apps/api/nest-cli.json

# Copy app-specific package.json
COPY apps/api/package.json ./apps/api/

# Copy other needed folders
COPY apps/api/src/prisma ./apps/api/src/prisma

# Install all dependencies (root + shared + app-specific)
RUN npm install

RUN npx prisma generate

# Copy full source code
COPY . .

# Build only the API app
WORKDIR /app/apps/api
RUN npm run build


# ---------- STAGE 2: Runtime ----------
FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV HUSKY=0
WORKDIR /app

# Copy package files and install only prod deps
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
RUN npm install --omit=dev
COPY apps/api/.env .env

# Copy Prisma schema before generating client
COPY --from=builder /app/apps/api/src/prisma ./prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy built app
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]