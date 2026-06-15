FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    PORT=5177 \
    YOUCHAT_API_BASE=http://host.docker.internal:18080/api

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY public ./public

RUN mkdir -p /app/logs /app/data /app/config

EXPOSE 5177

CMD ["node", "server.js"]
