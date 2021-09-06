#!/usr/bin/env sh
set -eu

envsubst '${HOST} ${SSL_CERT} ${SSL_CERT_KEY}' < /etc/nginx/conf.d/binom.conf.template > /etc/nginx/conf.d/binom.conf

exec "$@"