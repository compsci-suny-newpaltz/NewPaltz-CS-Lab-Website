# Production Dockerfile for NewPaltz CS Lab Website
# Multi-stage build for React frontend + Node.js backend

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --ignore-scripts || npm install --ignore-scripts
COPY client/ ./
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine AS production

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy server source
COPY server/ ./

# Copy built frontend to serve statically (optional - can use Apache/nginx)
COPY --from=frontend-builder /app/client/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "src/server.js"]
