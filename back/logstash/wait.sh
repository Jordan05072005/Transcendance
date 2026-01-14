#!/bin/sh
set -e

until curl -s -u elastic:changeme123 http://elasticsearch:9200 >/dev/null; do
  echo "Waiting for Elasticsearch..."
  sleep 3
done

exec /usr/share/logstash/bin/logstash -f /usr/share/logstash/pipeline/logstash.conf
