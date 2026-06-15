# Official Apache httpd image (multi-arch, maintained).
FROM httpd:2.4

# The proxy modules ship with the image but are commented out in the stock
# httpd.conf — enable mod_proxy and mod_proxy_http, then include our vhost.
RUN sed -i \
      -e 's/^#\(LoadModule proxy_module .*\)/\1/' \
      -e 's/^#\(LoadModule proxy_http_module .*\)/\1/' \
      /usr/local/apache2/conf/httpd.conf \
 && echo "Include conf/extra/verdaccio.conf" >> /usr/local/apache2/conf/httpd.conf

# Reverse-proxy virtual host.
COPY conf/verdaccio.conf /usr/local/apache2/conf/extra/verdaccio.conf
