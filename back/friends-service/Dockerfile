FROM node:20-bullseye-slim

WORKDIR /usr/src/app


RUN apt-get update && apt-get install -y --no-install-recommends bash  \
	&& apt-get install -y sqlite3 libsqlite3-dev\
	&& rm -rf /var/lib/apt/lists/*

COPY back/friends-service/package*.json ./
RUN npm ci

RUN npm install sqlite3

COPY back/friends-service/ ./

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
