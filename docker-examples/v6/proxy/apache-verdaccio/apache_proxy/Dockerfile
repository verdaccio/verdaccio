FROM eboraas/apache
MAINTAINER Juan Picado <juanpicado19@gmail.com>
# http://pierrecaserta.com/apache-proxy-one-docker-server-many-domains/
RUN a2enmod proxy
COPY ./conf/000-default.conf /etc/apache2/sites-enabled/000-default.conf
COPY ./conf/env.load /etc/apache2/mods-enabled/env.load