FROM node:24-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY src ./src
COPY scripts ./scripts

EXPOSE 3000

CMD ["node", "src/server.js"]
