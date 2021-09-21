FROM nginx:1.19.2

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/templates /etc/nginx/templates
COPY ./dist /golang/static
COPY ./public/i /golang/static/i
COPY ./public/v /golang/static/v
