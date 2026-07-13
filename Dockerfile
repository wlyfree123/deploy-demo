# ===== 构建阶段 =====
FROM node:22-alpine AS builder
WORKDIR /app

# 装依赖（利用 Docker 缓存）
COPY package*.json ./
RUN npm ci

# 生成 Prisma 客户端
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# 构建
COPY . .
RUN npm run build

# ===== 运行阶段 =====
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
