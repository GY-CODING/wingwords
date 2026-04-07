# Dockerfile for Next.js 16 + Node.js 20 + Yarn
# Multi-stage build for optimized production image

# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (only package.json and lockfile first for cache)
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production=false

# Copy all source code
COPY . .

# Build Next.js app
RUN yarn build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Install only production dependencies
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production=true --prefer-offline

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock* ./
COPY --from=builder /app/src ./src

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start Next.js app
CMD ["yarn", "start"]
