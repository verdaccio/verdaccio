# Official nginx image (multi-arch, maintained). The stock image loads every
# *.conf under /etc/nginx/conf.d, so we drop the default server and add ours.
FROM nginx:stable-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY sites-enabled/verdaccio-conf /etc/nginx/conf.d/verdaccio.conf
