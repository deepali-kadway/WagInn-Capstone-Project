# Multi-stage build for Node.js backend. Backend runs on Node.js in production
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Development stage. Fresh Node.js image
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/id-verification uploads/property-photos

# Expose port
EXPOSE 8080

# Start development server
CMD ["npm", "run", "dev"]

