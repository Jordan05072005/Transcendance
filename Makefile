.PHONY: init up down sup rebuild

CERT_DIR=certs
CERT_KEY=$(CERT_DIR)/server.key
CERT_CRT=$(CERT_DIR)/server.crt

up : certs
	docker-compose up -d

certs:
	@mkdir -p $(CERT_DIR)
	@if [ ! -f $(CERT_KEY) ]; then \
		echo "Generating dev certificates..."; \
		openssl req -x509 -newkey rsa:2048 -nodes \
			-keyout $(CERT_KEY) \
			-out $(CERT_CRT) \
			-days 365 \
			-subj "/CN=localhost"; \
		chmod 600 $(CERT_KEY); \
	fi

init:
	sudo systemctl start docker

treload: down up

build: certs
	docker-compose up --build -d

down:
	docker-compose down

sup:
	docker-compose down -v

restart: sup build

re: init down up

logauth:
	docker logs auth-service

back:
	docker-compose up --build back

front:
	docker-compose up --build front

mongo:
	docker-compose up --build mongo

