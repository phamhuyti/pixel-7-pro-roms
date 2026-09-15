FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG GIT_SHA=
ENV NEXT_TELEMETRY_DISABLED=1
# Stamp SHA + UTC time into the client bundle so the header mark changes every rebuild.
RUN apk add --no-cache git \
  && SHA="$GIT_SHA" \
  && if [ -z "$SHA" ] && [ -d .git ]; then SHA="$(git rev-parse --short HEAD)"; fi \
  && if [ -z "$SHA" ]; then SHA=docker; fi \
  && export NEXT_PUBLIC_BUILD_SHA="$SHA" \
  && export NEXT_PUBLIC_BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  && echo "web build mark $NEXT_PUBLIC_BUILD_SHA $NEXT_PUBLIC_BUILD_TIME" \
  && npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=43123
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 43123
CMD ["node", "server.js"]
