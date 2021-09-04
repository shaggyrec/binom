FROM nginx:1.19.2

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/binom.conf /etc/nginx/conf.d
COPY ./dist /golang/static
COPY ./public/i /golang/static/i
