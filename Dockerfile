# Production Dockerfile for NewPaltz CS Lab Website
# Multi-stage build for React frontend + Node.js backend
# Uses SQLite instead of MariaDB

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

# Install build tools needed for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production || npm install --only=production

# Copy server source
COPY server/ ./server/

# Copy built frontend to client/dist (where server.js expects it)
COPY --from=frontend-builder /app/client/dist ./client/dist

# Ensure data directory exists for SQLite database
RUN mkdir -p /app/server/data

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership of data directory so nodejs user can write to it
RUN chown -R nodejs:nodejs /app/server/data

USER nodejs

ENV NODE_ENV=production
ENV PORT=5001
ENV DB_PATH=/app/server/data/cslab.db

EXPOSE 5001

WORKDIR /app/server
CMD ["node", "src/server.js"]
