FROM node:20-bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends bash  \
	&& apt-get install -y sqlite3 libsqlite3-dev\
	&& rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y curl \
	&& rm -rf /var/lib/apt/lists/*

COPY back/auth-service/package*.json ./
RUN npm ci

RUN npm install sqlite3

COPY back/auth-service/ ./

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
