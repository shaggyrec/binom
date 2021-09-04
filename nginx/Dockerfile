FROM nginx:1.19.2

COPY nginx.conf /etc/nginx/nginx.conf
COPY binom.conf /etc/nginx/conf.d
COPY ../dist /golang/static
COPY ../public/i /golang/static/i
