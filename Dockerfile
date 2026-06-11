# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (for caching)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy rest of the application source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the project if you're using TypeScript (uncomment if needed)
# RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]
