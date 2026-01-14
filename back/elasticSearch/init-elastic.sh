#!/bin/sh
set -e

: "${ELASTIC_PASSWORD:=changeme123}"
ES_URL="http://elasticsearch:9200"

echo "Waiting for Elasticsearch (http) and elastic user..."
until curl -s -u "elastic:${ELASTIC_PASSWORD}" "${ES_URL}/" >/dev/null 2>&1; do
  printf "."
  sleep 2
done
echo
echo "Elasticsearch reachable — updating kibana_system password..."

# Mettre à jour le mot de passe de kibana_system (pas besoin de créer)
curl -s -u "elastic:${ELASTIC_PASSWORD}" -X POST "${ES_URL}/_security/user/kibana_system/_password" \
     -H 'Content-Type: application/json' \
     -d "{
           \"password\": \"${ELASTIC_PASSWORD}\"
         }"

echo "kibana_system password set to ELASTIC_PASSWORD"
exec /usr/local/bin/kibana-docker
