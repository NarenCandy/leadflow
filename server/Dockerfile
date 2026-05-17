# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install all dependencies including dev
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2 — Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]