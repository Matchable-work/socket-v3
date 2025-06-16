FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package.json
RUN npm ci --omit=dev
EXPOSE 4201
CMD ["node", "dist/index.js"]
