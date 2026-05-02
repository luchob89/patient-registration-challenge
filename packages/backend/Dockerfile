# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/backend/package.json ./packages/backend/package.json

# Install all deps (needed for prisma generate)
RUN pnpm install --frozen-lockfile

# Copy backend source
COPY packages/backend ./packages/backend

# Generate Prisma client and compile TypeScript
WORKDIR /app/packages/backend
RUN pnpm prisma generate
RUN pnpm build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests (needed for pnpm to resolve the workspace)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/backend/package.json ./packages/backend/package.json

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output and prisma artifacts
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/src/generated ./packages/backend/src/generated
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma

WORKDIR /app/packages/backend

EXPOSE 3001

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/index.js"]
