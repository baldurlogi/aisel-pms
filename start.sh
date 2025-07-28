#!/bin/sh
echo "🌱 Generating Prisma Client..."
pnpm --filter api exec prisma generate --schema=src/prisma/schema.prisma

echo "🌱 Running Prisma db push..."
pnpm --filter api prisma db push --schema=src/prisma/schema.prisma

echo "🚀 Starting app..."
node apps/api/dist/main.js