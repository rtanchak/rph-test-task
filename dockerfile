# ---------- Base ----------
  FROM node:24-alpine AS base
  WORKDIR /usr/src/app
  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable
  
  # ---------- Dependencies ----------
  FROM base AS deps
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile
  
  # ---------- Build ----------
  FROM base AS build
  COPY --from=deps /usr/src/app/node_modules ./node_modules
  COPY . .
  RUN pnpm run build
  
  # ---------- Runtime ----------
  FROM node:24-alpine AS runtime
  WORKDIR /usr/src/app
  ENV NODE_ENV=production
  ENV PNPM_HOME="/pnpm"
  ENV PATH="$PNPM_HOME:$PATH"
  RUN corepack enable
  
  COPY --from=build /usr/src/app/dist ./dist
  COPY --from=deps /usr/src/app/node_modules ./node_modules
  COPY package.json ./
  
  EXPOSE 3000
  CMD ["node", "dist/main.js"]
