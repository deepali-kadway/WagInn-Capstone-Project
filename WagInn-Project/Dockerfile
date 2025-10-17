# Multi-stage build for Angular frontend
FROM node:16-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli@16

# Development stage 
FROM base AS development

# Install all dependencies (including @angular-devkit/build-angular)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Expose Angular default dev port
EXPOSE 4200

# Run Angular dev server with hot reload enabled and verbose logging
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000", "--live-reload", "true", "--verbose", "--watch"]

