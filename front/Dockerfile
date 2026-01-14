FROM node:20-bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends bash \
 && rm -rf /var/lib/apt/lists/*

COPY front/package*.json ./

RUN npm ci

COPY .env ./

COPY front/ ./

ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 5173

CMD ["npm", "run", "dev"]
