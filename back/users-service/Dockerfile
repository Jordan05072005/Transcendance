FROM node:20-bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends bash  \
	&& apt-get install -y sqlite3 libsqlite3-dev\
	&& rm -rf /var/lib/apt/lists/*

COPY back/users-service/package*.json ./
RUN npm ci

RUN npm install sqlite3

COPY back/users-service/ ./

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
