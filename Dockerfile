# Dockerfile para una aplicación Astro (estática)

# --- Dependencias ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# --- Producción ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN apk update && apk upgrade && apk add --no-cache dumb-init
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4321

ENTRYPOINT ["dumb-init", "--"]

CMD ["serve", "dist", "-l", "4321"]
