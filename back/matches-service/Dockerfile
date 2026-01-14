FROM node:20-bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends bash  \
	&& apt-get install -y sqlite3 libsqlite3-dev\
	&& rm -rf /var/lib/apt/lists/*

COPY back/matches-service/package*.json ./
RUN npm install

RUN npm install sqlite3

COPY back/matches-service/ ./

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
