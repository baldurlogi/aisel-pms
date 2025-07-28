#!/bin/sh

echo "🌱 Running Prisma db push..."
pnpm --filter api prisma db push --schema=apps/api/src/prisma/schema.prisma

echo "🚀 Starting app..."
node dist/main.js